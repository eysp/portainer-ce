package sdk

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAppendChartReferenceAnnotations(t *testing.T) {
	tests := []struct {
		name       string
		chartPath  string
		repoURL    string
		registryID int
		stackID    int
		existing   map[string]string
		want       map[string]string
	}{
		{
			name:       "with registry ID",
			chartPath:  "charts/nginx",
			registryID: 5,
			stackID:    123,
			want: map[string]string{
				ChartPathAnnotation:  "charts/nginx",
				RegistryIDAnnotation: "5",
				StackIDAnnotation:    "123",
				// repoURL is NOT added when registryID != 0
			},
		},
		{
			name:      "with repo URL (no registry)",
			chartPath: "charts/nginx",
			repoURL:   "https://charts.example.com",
			stackID:   123,
			want: map[string]string{
				ChartPathAnnotation: "charts/nginx",
				RepoURLAnnotation:   "https://charts.example.com",
				StackIDAnnotation:   "123",
			},
		},
		{
			name:      "preserves custom annotations",
			chartPath: "my-chart",
			existing:  map[string]string{"custom": "value"},
			want: map[string]string{
				ChartPathAnnotation: "my-chart",
				"custom":            "value",
			},
		},
		{
			name:      "replaces old chart annotations",
			chartPath: "new-chart",
			repoURL:   "https://new.com",
			existing: map[string]string{
				ChartPathAnnotation: "old-chart",
				RepoURLAnnotation:   "https://old.com",
			},
			want: map[string]string{
				ChartPathAnnotation: "new-chart",
				RepoURLAnnotation:   "https://new.com",
			},
		},
		{
			name:      "omits zero values",
			chartPath: "chart",
			want: map[string]string{
				ChartPathAnnotation: "chart",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := appendChartReferenceAnnotations(
				tt.chartPath, tt.repoURL, tt.registryID, tt.stackID,
				nil, nil, tt.existing,
			)

			assert.Equal(t, tt.want, result)
		})
	}
}

func TestAppendChartReferenceAnnotations_RepoURLLogic(t *testing.T) {
	t.Run("repoURL only added when registryID is zero", func(t *testing.T) {
		// With registry ID - no repoURL
		result := appendChartReferenceAnnotations("chart", "url", 5, 0, nil, nil, nil)
		_, hasRepoURL := result[RepoURLAnnotation]
		assert.False(t, hasRepoURL)

		// Without registry ID - includes repoURL
		result = appendChartReferenceAnnotations("chart", "url", 0, 0, nil, nil, nil)
		assert.Equal(t, "url", result[RepoURLAnnotation])
	})

	t.Run("does not mutate existing map", func(t *testing.T) {
		existing := map[string]string{"key": "value"}
		appendChartReferenceAnnotations("chart", "", 0, 0, nil, nil, existing)
		assert.Equal(t, map[string]string{"key": "value"}, existing)
	})
}
