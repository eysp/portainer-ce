package libkubectl

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestResourcesToArgsHelper(t *testing.T) {
	tests := []struct {
		name         string
		resources    []string
		expectedArgs []string
	}{
		{
			name:         "empty list",
			resources:    []string{},
			expectedArgs: []string{},
		},
		{
			name:         "single manifest file",
			resources:    []string{"manifest.yaml"},
			expectedArgs: []string{"-f", "manifest.yaml"},
		},
		{
			name:         "multiple manifest files",
			resources:    []string{"manifest1.yaml", "manifest2.yaml"},
			expectedArgs: []string{"-f", "manifest1.yaml", "-f", "manifest2.yaml"},
		},
		{
			name:         "manifests with whitespace",
			resources:    []string{" manifest1.yaml ", "  manifest2.yaml"},
			expectedArgs: []string{"-f", "manifest1.yaml", "-f", "manifest2.yaml"},
		},
		{
			name:         "kubernetes resource definitions",
			resources:    []string{"deployment/nginx", "service/web"},
			expectedArgs: []string{"deployment/nginx", "service/web"},
		},
		{
			name:         "rollout restart",
			resources:    []string{"deployment/nginx", "service/web"},
			expectedArgs: []string{"deployment/nginx", "service/web"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			args := resourcesToArgs(tt.resources)
			assert.Equal(t, tt.expectedArgs, args)
		})
	}
}
