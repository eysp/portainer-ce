package sdk

import (
	"testing"

	libhelmrelease "github.com/portainer/portainer/pkg/libhelm/release"
	"github.com/stretchr/testify/assert"
	"helm.sh/helm/v3/pkg/chart"
	sdkrelease "helm.sh/helm/v3/pkg/release"
)

func Test_Convert(t *testing.T) {
	t.Run("successfully maps a sdk release to a release", func(t *testing.T) {
		is := assert.New(t)

		release := sdkrelease.Release{
			Name:    "releaseName",
			Version: 1,
			Info: &sdkrelease.Info{
				Status: "deployed",
			},
			Chart: &chart.Chart{
				Metadata: &chart.Metadata{
					Name:       "chartName",
					Version:    "chartVersion",
					AppVersion: "chartAppVersion",
				},
			},
		}

		values := libhelmrelease.Values{
			UserSuppliedValues: `{"key": "value"}`,
			ComputedValues:     `{"key": "value"}`,
		}

		result := convert(&release, values)
		is.Equal(release.Name, result.Name)
	})
}
