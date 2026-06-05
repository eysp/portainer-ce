package registryhttp

import (
	"net/http"

	portainer "github.com/portainer/portainer/api"

	"github.com/rs/zerolog/log"
	"oras.land/oras-go/v2/registry/remote/retry"
)

// CreateClient creates an HTTP client with appropriate TLS configuration based on registry type.
// All registries use retry clients for better resilience.
// Returns the HTTP client, whether to use plainHTTP, and any error.
func CreateClient(registry *portainer.Registry) (httpClient *http.Client, usePlainHttp bool, err error) {
	switch registry.Type {
	case portainer.AzureRegistry, portainer.EcrRegistry, portainer.GithubRegistry, portainer.GitlabRegistry, portainer.DockerHubRegistry:
		// Cloud registries use the default retry client with built-in TLS
		return retry.DefaultClient, false, nil
	default:
		// For all other registry types, use shared helper to build transport and scheme

		tlsCfg := portainer.TLSConfiguration{}
		if registry.ManagementConfiguration != nil {
			tlsCfg = registry.ManagementConfiguration.TLSConfig
		}

		transport, scheme, err := BuildTransportAndSchemeFromTLSConfig(tlsCfg)
		if err != nil {
			log.Error().Err(err).Msg("Failed to create TLS configuration")
			return nil, false, err
		}

		return &http.Client{Transport: retry.NewTransport(transport)}, scheme == "http", nil
	}
}
