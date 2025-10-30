package sdk

import (
	"encoding/json"
	"testing"

	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/stretchr/testify/assert"
)

type testCase struct {
	name    string
	url     string
	invalid bool
}

var tests = []testCase{
	{"not a helm repo", "https://portainer.io", true},
	{"ingress helm repo", "https://kubernetes.github.io/ingress-nginx", false},
	{"portainer helm repo", "https://portainer.github.io/k8s/", false},
	{"elastic helm repo with trailing slash", "https://helm.elastic.co/", false},
}

func Test_SearchRepo(t *testing.T) {
	is := assert.New(t)

	// Create a new SDK package manager
	hspm := NewHelmSDKPackageManager()

	for _, test := range tests {
		func(tc testCase) {
			t.Run(tc.name, func(t *testing.T) {
				t.Parallel()
				response, err := hspm.SearchRepo(options.SearchRepoOptions{Repo: tc.url})
				if tc.invalid {
					is.Errorf(err, "error expected: %s", tc.url)
				} else {
					is.NoError(err, "no error expected: %s", tc.url)
				}

				if err == nil {
					is.NotEmpty(response, "response expected")
				}
			})
		}(test)
	}

	t.Run("search repo with keyword", func(t *testing.T) {
		// Search for charts with keyword
		searchOpts := options.SearchRepoOptions{
			Repo: "https://kubernetes.github.io/ingress-nginx",
		}
		responseBytes, err := hspm.SearchRepo(searchOpts)

		// The function should not fail by design, even when not running in a k8s environment
		is.NoError(err, "should not return error when not in k8s environment")
		is.NotNil(responseBytes, "should return non-nil response")
		is.NotEmpty(responseBytes, "should return non-empty response")

		// Parse the 	ext response
		var repoIndex RepoIndex
		err = json.Unmarshal(responseBytes, &repoIndex)
		is.NoError(err, "should parse JSON response without error")
		is.NotEmpty(repoIndex, "should have at least one chart")

		// Verify charts structure apiVersion, entries, generated
		is.Equal("v1", repoIndex.APIVersion, "apiVersion should be v1")
		is.NotEmpty(repoIndex.Entries, "entries should not be empty")
		is.NotEmpty(repoIndex.Generated, "generated should not be empty")

		// there should be at least one chart
		is.Greater(len(repoIndex.Entries), 0, "should have at least one chart")
	})

	t.Run("search repo with empty repo URL", func(t *testing.T) {
		// Search with empty repo URL
		searchOpts := options.SearchRepoOptions{
			Repo: "",
		}
		_, err := hspm.SearchRepo(searchOpts)
		is.Error(err, "should return error when repo URL is empty")
	})
}
