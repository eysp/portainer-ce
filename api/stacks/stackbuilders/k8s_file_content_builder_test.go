package stackbuilders

import (
	"testing"

	"github.com/portainer/portainer/api/stacks/deployments"
	"github.com/stretchr/testify/require"
)

type mockDeploymentConfiger struct {
	deployments.StackDeploymentConfiger
}

func (m mockDeploymentConfiger) GetResponse() string {
	return "mock response"
}

func TestGetResponse(t *testing.T) {
	c := &K8sStackFileContentBuilder{
		FileContentMethodStackBuilder: FileContentMethodStackBuilder{
			StackBuilder: StackBuilder{
				deploymentConfiger: mockDeploymentConfiger{},
			},
		},
	}

	require.Equal(t, "mock response", c.GetResponse())
}
