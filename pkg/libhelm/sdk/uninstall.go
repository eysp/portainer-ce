package sdk

import (
	"github.com/pkg/errors"
	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
)

// Uninstall implements the HelmPackageManager interface by using the Helm SDK to uninstall a release.
func (hspm *HelmSDKPackageManager) Uninstall(uninstallOpts options.UninstallOptions) error {
	if uninstallOpts.Name == "" {
		log.Error().
			Str("context", "HelmClient").
			Msg("Release name is required")
		return errors.New("release name is required")
	}

	log.Debug().
		Str("context", "HelmClient").
		Str("release", uninstallOpts.Name).
		Str("namespace", uninstallOpts.Namespace).
		Msg("Uninstalling Helm release")

	// Initialize action configuration with kubernetes config
	actionConfig := new(action.Configuration)
	err := hspm.initActionConfig(actionConfig, uninstallOpts.Namespace, uninstallOpts.KubernetesClusterAccess)
	if err != nil {
		// error is already logged in initActionConfig
		return errors.Wrap(err, "failed to initialize helm configuration")
	}

	// Create uninstallClient action
	uninstallClient := action.NewUninstall(actionConfig)
	// 'foreground' means the parent object remains in a "terminating" state until all of its children are deleted. This ensures that all dependent resources are completely removed before finalizing the deletion of the parent resource.
	uninstallClient.DeletionPropagation = "foreground" // "background" or "orphan"

	// Run the uninstallation
	log.Info().
		Str("context", "HelmClient").
		Str("release", uninstallOpts.Name).
		Str("namespace", uninstallOpts.Namespace).
		Msg("Running uninstallation")

	result, err := uninstallClient.Run(uninstallOpts.Name)
	if err != nil {
		log.Error().
			Str("context", "HelmClient").
			Str("release", uninstallOpts.Name).
			Str("namespace", uninstallOpts.Namespace).
			Err(err).
			Msg("Failed to uninstall helm release")
		return errors.Wrap(err, "failed to uninstall helm release")
	}

	if result != nil {
		log.Debug().
			Str("context", "HelmClient").
			Str("release", uninstallOpts.Name).
			Str("release_info", result.Release.Info.Description).
			Msg("Uninstall result details")
	}

	return nil
}
