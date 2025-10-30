package kubernetes

import (
	"net/http"
	"strings"
)

func (transport *baseTransport) proxyPodsRequest(request *http.Request, namespace string) (*http.Response, error) {
	if request.Method == http.MethodDelete {
		transport.refreshRegistry(request, namespace)
	}

	if request.Method == http.MethodPost && strings.Contains(request.URL.Path, "/exec") {
		if err := transport.addTokenForExec(request); err != nil {
			return nil, err
		}
	}
	return transport.executeKubernetesRequest(request)
}
