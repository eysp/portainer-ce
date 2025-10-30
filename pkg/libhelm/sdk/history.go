package sdk

import (
	"sort"

	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/release"
	"github.com/portainer/portainer/pkg/libhelm/time"
	"github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
	sdkrelease "helm.sh/helm/v3/pkg/release"
)

// GetHistory implements the HelmPackageManager interface by using the Helm SDK to get a release.
// It returns a Release.
func (hspm *HelmSDKPackageManager) GetHistory(historyOptions options.HistoryOptions) ([]*release.Release, error) {
	log.Debug().
		Str("context", "HelmClient").
		Str("namespace", historyOptions.Namespace).
		Str("name", historyOptions.Name).
		Msg("Get Helm history")

	actionConfig := new(action.Configuration)
	err := hspm.initActionConfig(actionConfig, historyOptions.Namespace, historyOptions.KubernetesClusterAccess)

	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("namespace", historyOptions.Namespace).
			Err(err).Msg("Failed to initialise helm configuration")
		return nil, err
	}

	historyClient := action.NewHistory(actionConfig)
	history, err := historyClient.Run(historyOptions.Name)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("namespace", historyOptions.Namespace).
			Err(err).Msg("Failed to query helm release history")
		return nil, err
	}

	var result []*release.Release
	for _, r := range history {
		result = append(result, convertHistory(r))
	}

	// sort the result by version (latest first)
	sort.Slice(result, func(i, j int) bool {
		return result[i].Version > result[j].Version
	})

	return result, nil
}

func convertHistory(sdkRelease *sdkrelease.Release) *release.Release {
	return &release.Release{
		Name:      sdkRelease.Name,
		Namespace: sdkRelease.Namespace,
		Version:   sdkRelease.Version,
		Info: &release.Info{
			Status:       release.Status(sdkRelease.Info.Status),
			Notes:        sdkRelease.Info.Notes,
			LastDeployed: time.Time(sdkRelease.Info.LastDeployed),
		},
		Chart: release.Chart{
			Metadata: &release.Metadata{
				Name:       sdkRelease.Chart.Metadata.Name,
				Version:    sdkRelease.Chart.Metadata.Version,
				AppVersion: sdkRelease.Chart.Metadata.AppVersion,
			},
		},
	}
}
