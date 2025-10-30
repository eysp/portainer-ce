package cli

import (
	"testing"
)

func TestClearUserClientCache(t *testing.T) {
	factory, _ := NewClientFactory(nil, nil, nil, "", "", "")
	kcl := &KubeClient{}
	factory.endpointProxyClients.Set("12.1", kcl, 0)
	factory.endpointProxyClients.Set("12.12", kcl, 0)
	factory.endpointProxyClients.Set("12", kcl, 0)

	factory.ClearUserClientCache("12")

	if len(factory.endpointProxyClients.Items()) != 2 {
		t.Errorf("Incorrect clients cached after clearUserClientCache;\ngot=\n%d\nwant=\n%d", len(factory.endpointProxyClients.Items()), 2)
	}
	if _, ok := factory.GetProxyKubeClient("12", "12"); ok {
		t.Errorf("Expected not to find client cache for user after clear")
	}
}
