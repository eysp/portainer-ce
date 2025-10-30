package stackbuilders

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestK8SUrlBuilderGetResponse(t *testing.T) {
	c := &KubernetesStackUrlBuilder{
		UrlMethodStackBuilder: UrlMethodStackBuilder{
			StackBuilder: StackBuilder{
				deploymentConfiger: mockDeploymentConfiger{},
			},
		},
	}

	require.Equal(t, "mock response", c.GetResponse())
}
