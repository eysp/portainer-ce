package sdk

import (
	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/release"
	"github.com/portainer/portainer/pkg/libhelm/time"
	"github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
	sdkrelease "helm.sh/helm/v3/pkg/release"
)

// Get implements the HelmPackageManager interface by using the Helm SDK to get a release.
// It returns a Release.
func (hspm *HelmSDKPackageManager) Get(getOptions options.GetOptions) (*release.Release, error) {
	log.Debug().
		Str("context", "HelmClient").
		Str("namespace", getOptions.Namespace).
		Str("name", getOptions.Name).
		Msg("Get Helm release")

	actionConfig := new(action.Configuration)
	err := hspm.initActionConfig(actionConfig, getOptions.Namespace, getOptions.KubernetesClusterAccess)

	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("namespace", getOptions.Namespace).
			Err(err).Msg("Failed to initialise helm configuration")
		return nil, err
	}

	statusClient, err := hspm.initStatusClient(actionConfig, getOptions)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("namespace", getOptions.Namespace).
			Err(err).Msg("Failed to initialise helm status client")
		return nil, err
	}

	release, err := statusClient.Run(getOptions.Name)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("namespace", getOptions.Namespace).
			Err(err).Msg("Failed to query helm chart")
		return nil, err
	}

	values, err := hspm.getValues(getOptions)
	if err != nil {
		// error is already logged in getValuesFromStatus
		return nil, err
	}

	return convert(release, values), nil
}

// Helm status is just an extended helm get command with resources added on (when flagged), so use the status client with the optional show resources flag
// https://github.com/helm/helm/blob/0199b748aaea3091852d16687c9f9f809061777c/pkg/action/get.go#L40-L47
// https://github.com/helm/helm/blob/0199b748aaea3091852d16687c9f9f809061777c/pkg/action/status.go#L48-L82
func (hspm *HelmSDKPackageManager) initStatusClient(actionConfig *action.Configuration, getOptions options.GetOptions) (*action.Status, error) {
	statusClient := action.NewStatus(actionConfig)
	statusClient.ShowResources = getOptions.ShowResources
	if getOptions.Revision > 0 {
		statusClient.Version = getOptions.Revision
	}

	return statusClient, nil
}

func convert(sdkRelease *sdkrelease.Release, values release.Values) *release.Release {
	resources, err := parseResources(sdkRelease.Info.Resources)
	if err != nil {
		log.Warn().
			Str("context", "HelmClient").
			Str("namespace", sdkRelease.Namespace).
			Str("name", sdkRelease.Name).
			Err(err).Msg("Failed to parse resources")
	}
	return &release.Release{
		Name:      sdkRelease.Name,
		Namespace: sdkRelease.Namespace,
		Version:   sdkRelease.Version,
		Info: &release.Info{
			Status:       release.Status(sdkRelease.Info.Status),
			Notes:        sdkRelease.Info.Notes,
			Resources:    resources,
			Description:  sdkRelease.Info.Description,
			LastDeployed: time.Time(sdkRelease.Info.LastDeployed),
		},
		Manifest: sdkRelease.Manifest,
		Chart: release.Chart{
			Metadata: &release.Metadata{
				Name:       sdkRelease.Chart.Metadata.Name,
				Version:    sdkRelease.Chart.Metadata.Version,
				AppVersion: sdkRelease.Chart.Metadata.AppVersion,
			},
		},
		Values:         values,
		ChartReference: extractChartReferenceAnnotations(sdkRelease.Chart.Metadata.Annotations),
	}
}
