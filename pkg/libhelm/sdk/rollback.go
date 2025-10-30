package sdk

import (
	"time"

	"github.com/pkg/errors"
	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/release"
	"github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
)

// Rollback would implement the HelmPackageManager interface by using the Helm SDK to rollback a release to a previous revision.
func (hspm *HelmSDKPackageManager) Rollback(rollbackOpts options.RollbackOptions) (*release.Release, error) {
	log.Debug().
		Str("context", "HelmClient").
		Str("name", rollbackOpts.Name).
		Str("namespace", rollbackOpts.Namespace).
		Int("revision", rollbackOpts.Version).
		Bool("wait", rollbackOpts.Wait).
		Msg("Rolling back Helm release")

	if rollbackOpts.Name == "" {
		log.Error().
			Str("context", "HelmClient").
			Msg("Name is required for helm release rollback")
		return nil, errors.New("name is required for helm release rollback")
	}

	// Initialize action configuration with kubernetes config
	actionConfig := new(action.Configuration)
	err := hspm.initActionConfig(actionConfig, rollbackOpts.Namespace, rollbackOpts.KubernetesClusterAccess)
	if err != nil {
		return nil, errors.Wrap(err, "failed to initialize helm configuration for helm release rollback")
	}

	rollbackClient := initRollbackClient(actionConfig, rollbackOpts)

	// Run the rollback
	err = rollbackClient.Run(rollbackOpts.Name)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("name", rollbackOpts.Name).
			Str("namespace", rollbackOpts.Namespace).
			Int("revision", rollbackOpts.Version).
			Err(err).
			Msg("Failed to rollback helm release")
		return nil, errors.Wrap(err, "helm was not able to rollback the release")
	}

	// Get the release info after rollback
	statusClient := action.NewStatus(actionConfig)
	rel, err := statusClient.Run(rollbackOpts.Name)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("name", rollbackOpts.Name).
			Str("namespace", rollbackOpts.Namespace).
			Int("revision", rollbackOpts.Version).
			Err(err).
			Msg("Failed to get status after rollback")
		return nil, errors.Wrap(err, "failed to get status after rollback")
	}

	return &release.Release{
		Name:      rel.Name,
		Namespace: rel.Namespace,
		Version:   rel.Version,
		Info: &release.Info{
			Status:      release.Status(rel.Info.Status),
			Notes:       rel.Info.Notes,
			Description: rel.Info.Description,
		},
		Manifest: rel.Manifest,
		Chart: release.Chart{
			Metadata: &release.Metadata{
				Name:       rel.Chart.Metadata.Name,
				Version:    rel.Chart.Metadata.Version,
				AppVersion: rel.Chart.Metadata.AppVersion,
			},
		},
		Labels: rel.Labels,
	}, nil
}

// initRollbackClient initializes the rollback client with the given options
// and returns the rollback client.
func initRollbackClient(actionConfig *action.Configuration, rollbackOpts options.RollbackOptions) *action.Rollback {
	rollbackClient := action.NewRollback(actionConfig)

	// Set version to rollback to (if specified)
	if rollbackOpts.Version > 0 {
		rollbackClient.Version = rollbackOpts.Version
	}

	rollbackClient.Wait = rollbackOpts.Wait
	rollbackClient.WaitForJobs = rollbackOpts.WaitForJobs
	rollbackClient.CleanupOnFail = true // Sane default to clean up on failure
	rollbackClient.Recreate = rollbackOpts.Recreate
	rollbackClient.Force = rollbackOpts.Force

	// Set default values if not specified
	if rollbackOpts.Timeout == 0 {
		rollbackClient.Timeout = 5 * time.Minute // Sane default of 5 minutes
	} else {
		rollbackClient.Timeout = rollbackOpts.Timeout
	}

	return rollbackClient
}
