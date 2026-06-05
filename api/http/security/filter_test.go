package security

import (
	"testing"

	portainer "github.com/portainer/portainer/api"
)

func TestFilterEndpointsPanic(t *testing.T) {
	endpoints := []portainer.Endpoint{{ID: 1}}
	groups := []portainer.EndpointGroup{}
	context := &RestrictedRequestContext{}

	FilterEndpoints(endpoints, groups, context)
}
