package sdk

import (
	"fmt"

	"github.com/pkg/errors"
	"github.com/portainer/portainer/pkg/libhelm/options"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/storage/driver"
)

func (hspm *HelmSDKPackageManager) doesReleaseExist(releaseName, namespace string, clusterAccess *options.KubernetesClusterAccess) (bool, error) {
	// Initialize action configuration
	actionConfig := new(action.Configuration)
	err := hspm.initActionConfig(actionConfig, namespace, clusterAccess)
	if err != nil {
		// error is already logged in initActionConfig
		return false, fmt.Errorf("failed to initialize helm configuration: %w", err)
	}

	historyClient, err := hspm.initHistoryClient(actionConfig, namespace, clusterAccess)
	if err != nil {
		// error is already logged in initHistoryClient
		return false, fmt.Errorf("failed to initialize helm history client: %w", err)
	}

	versions, err := historyClient.Run(releaseName)
	if errors.Is(err, driver.ErrReleaseNotFound) || isReleaseUninstalled(versions) {
		return false, nil
	} else if err != nil {
		return false, fmt.Errorf("failed to get history: %w", err)
	}

	return true, nil
}

func isReleaseUninstalled(versions []*release.Release) bool {
	return len(versions) > 0 && versions[len(versions)-1].Info.Status == release.StatusUninstalled
}

func (hspm *HelmSDKPackageManager) initHistoryClient(actionConfig *action.Configuration, namespace string, clusterAccess *options.KubernetesClusterAccess) (*action.History, error) {
	historyClient := action.NewHistory(actionConfig)
	historyClient.Max = 1

	return historyClient, nil
}
