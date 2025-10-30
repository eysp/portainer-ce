package sdk

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/time"
)

func Test_ConvertToReleaseElements(t *testing.T) {
	is := assert.New(t)

	// Create mock releases
	releases := []*release.Release{
		{
			Name:      "release1",
			Namespace: "default",
			Version:   1,
			Info: &release.Info{
				Status:       release.StatusDeployed,
				LastDeployed: time.Now(),
			},
			Chart: &chart.Chart{
				Metadata: &chart.Metadata{
					Name:       "chart1",
					Version:    "1.0.0",
					AppVersion: "1.0.0",
				},
			},
		},
		{
			Name:      "release2",
			Namespace: "kube-system",
			Version:   2,
			Info: &release.Info{
				Status:       release.StatusFailed,
				LastDeployed: time.Now(),
			},
			Chart: &chart.Chart{
				Metadata: &chart.Metadata{
					Name:       "chart2",
					Version:    "2.0.0",
					AppVersion: "2.0.0",
				},
			},
		},
	}

	// Convert to release elements
	elements := convertToReleaseElements(releases)

	// Verify conversion
	is.Len(elements, 2, "should return 2 release elements")

	// Verify first release
	is.Equal("release1", elements[0].Name, "first release name should be release1")
	is.Equal("default", elements[0].Namespace, "first release namespace should be default")
	is.Equal("1", elements[0].Revision, "first release revision should be 1")
	is.Equal(string(release.StatusDeployed), elements[0].Status, "first release status should be deployed")
	is.Equal("chart1-1.0.0", elements[0].Chart, "first release chart should be chart1-1.0.0")
	is.Equal("1.0.0", elements[0].AppVersion, "first release app version should be 1.0.0")

	// Verify second release
	is.Equal("release2", elements[1].Name, "second release name should be release2")
	is.Equal("kube-system", elements[1].Namespace, "second release namespace should be kube-system")
	is.Equal("2", elements[1].Revision, "second release revision should be 2")
	is.Equal(string(release.StatusFailed), elements[1].Status, "second release status should be failed")
	is.Equal("chart2-2.0.0", elements[1].Chart, "second release chart should be chart2-2.0.0")
	is.Equal("2.0.0", elements[1].AppVersion, "second release app version should be 2.0.0")
}
