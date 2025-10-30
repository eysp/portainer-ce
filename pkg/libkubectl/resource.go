package libkubectl

import "strings"

func isManifestFile(resource string) bool {
	trimmedResource := strings.TrimSpace(resource)
	return strings.HasSuffix(trimmedResource, ".yaml") || strings.HasSuffix(trimmedResource, ".yml")
}

func resourcesToArgs(resources []string) []string {
	args := []string{}
	for _, resource := range resources {
		if isManifestFile(resource) {
			args = append(args, "-f", strings.TrimSpace(resource))
		} else {
			args = append(args, resource)
		}
	}
	return args
}
