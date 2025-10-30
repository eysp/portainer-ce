package testhelpers

import (
	portainer "github.com/portainer/portainer/api"
	models "github.com/portainer/portainer/api/http/models/kubernetes"
)

type testKubeClient struct {
	portainer.KubeClient
}

func NewKubernetesClient() portainer.KubeClient {
	return &testKubeClient{}
}

// Event
func (kcl *testKubeClient) GetEvents(namespace string, resourceId string) ([]models.K8sEvent, error) {
	return nil, nil
}
