package kubernetes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	portainer "github.com/portainer/portainer/api"
	"github.com/portainer/portainer/api/datastore"
	"github.com/portainer/portainer/api/http/security"
	"github.com/portainer/portainer/api/internal/authorization"
	"github.com/portainer/portainer/api/internal/testhelpers"
	"github.com/portainer/portainer/api/jwt"
	"github.com/portainer/portainer/api/kubernetes"
	kubeClient "github.com/portainer/portainer/api/kubernetes/cli"
	"github.com/stretchr/testify/assert"
)

// Currently this test just tests the HTTP Handler is setup correctly, in the future we should move the ClientFactory to a mock in order
// test the logic in event.go
func TestGetKubernetesEvents(t *testing.T) {
	is := assert.New(t)

	_, store := datastore.MustNewTestStore(t, true, true)

	err := store.Endpoint().Create(&portainer.Endpoint{
		ID:   1,
		Type: portainer.AgentOnKubernetesEnvironment,
	},
	)
	is.NoError(err, "error creating environment")

	err = store.User().Create(&portainer.User{Username: "admin", Role: portainer.AdministratorRole})
	is.NoError(err, "error creating a user")

	jwtService, err := jwt.NewService("1h", store)
	is.NoError(err, "Error initiating jwt service")

	tk, _, _ := jwtService.GenerateToken(&portainer.TokenData{ID: 1, Username: "admin", Role: portainer.AdministratorRole})

	kubeClusterAccessService := kubernetes.NewKubeClusterAccessService("", "", "")

	cli := testhelpers.NewKubernetesClient()
	factory, _ := kubeClient.NewClientFactory(nil, nil, store, "", "", "")

	authorizationService := authorization.NewService(store)
	handler := NewHandler(testhelpers.NewTestRequestBouncer(), authorizationService, store, jwtService, kubeClusterAccessService,
		factory, cli)
	is.NotNil(handler, "Handler should not fail")

	req := httptest.NewRequest(http.MethodGet, "/kubernetes/1/events?resourceId=8", nil)
	ctx := security.StoreTokenData(req, &portainer.TokenData{ID: 1, Username: "admin", Role: 1})
	req = req.WithContext(ctx)
	testhelpers.AddTestSecurityCookie(req, tk)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	is.Equal(http.StatusOK, rr.Code, "Status should be 200")
}
