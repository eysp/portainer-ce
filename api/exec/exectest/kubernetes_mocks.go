package exectest

import (
	portainer "github.com/portainer/portainer/api"
)

type kubernetesMockDeployer struct {
	portainer.KubernetesDeployer
}

// NewKubernetesDeployer creates a mock kubernetes deployer
func NewKubernetesDeployer() *kubernetesMockDeployer {
	return &kubernetesMockDeployer{}
}

func (deployer *kubernetesMockDeployer) Deploy(userID portainer.UserID, endpoint *portainer.Endpoint, manifestFiles []string, namespace string) (string, error) {
	return "", nil
}

func (deployer *kubernetesMockDeployer) Remove(userID portainer.UserID, endpoint *portainer.Endpoint, manifestFiles []string, namespace string) (string, error) {
	return "", nil
}

func (deployer *kubernetesMockDeployer) Restart(userID portainer.UserID, endpoint *portainer.Endpoint, manifestFiles []string, namespace string) (string, error) {
	return "", nil
}
