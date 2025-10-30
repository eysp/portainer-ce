package helm

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	portainer "github.com/portainer/portainer/api"
	"github.com/portainer/portainer/api/datastore"
	"github.com/portainer/portainer/api/exec/exectest"
	"github.com/portainer/portainer/api/http/security"
	"github.com/portainer/portainer/api/internal/testhelpers"
	"github.com/portainer/portainer/api/jwt"
	"github.com/portainer/portainer/api/kubernetes"
	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/release"
	"github.com/portainer/portainer/pkg/libhelm/test"

	"github.com/segmentio/encoding/json"
	"github.com/stretchr/testify/assert"
)

func Test_helmGet(t *testing.T) {
	is := assert.New(t)

	_, store := datastore.MustNewTestStore(t, true, true)

	err := store.Endpoint().Create(&portainer.Endpoint{ID: 1})
	is.NoError(err, "Error creating environment")

	err = store.User().Create(&portainer.User{Username: "admin", Role: portainer.AdministratorRole})
	is.NoError(err, "Error creating a user")

	jwtService, err := jwt.NewService("1h", store)
	is.NoError(err, "Error initiating jwt service")

	kubernetesDeployer := exectest.NewKubernetesDeployer()
	helmPackageManager := test.NewMockHelmPackageManager()
	kubeClusterAccessService := kubernetes.NewKubeClusterAccessService("", "", "")
	h := NewHandler(testhelpers.NewTestRequestBouncer(), store, jwtService, kubernetesDeployer, helmPackageManager, kubeClusterAccessService)

	is.NotNil(h, "Handler should not fail")

	// Install a single chart, to be retrieved by the handler
	options := options.InstallOptions{Name: "nginx-1", Chart: "nginx", Namespace: "default"}
	h.helmPackageManager.Upgrade(options)

	t.Run("helmGet sucessfuly retrieves helm release", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/1/kubernetes/helm/"+options.Name+"?namespace="+options.Namespace, nil)
		ctx := security.StoreTokenData(req, &portainer.TokenData{ID: 1, Username: "admin", Role: 1})
		req = req.WithContext(ctx)
		testhelpers.AddTestSecurityCookie(req, "Bearer dummytoken")

		rr := httptest.NewRecorder()
		h.ServeHTTP(rr, req)

		data := release.Release{}
		body, err := io.ReadAll(rr.Body)
		is.NoError(err, "ReadAll should not return error")
		json.Unmarshal(body, &data)
		is.Equal(http.StatusOK, rr.Code, "Status should be 200")
		is.Equal("nginx-1", data.Name)
	})
}
