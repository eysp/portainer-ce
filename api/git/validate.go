package git

import (
	gittypes "github.com/portainer/portainer/api/git/types"
	httperrors "github.com/portainer/portainer/api/http/errors"
	"github.com/portainer/portainer/pkg/validate"
)

func ValidateRepoConfig(repoConfig *gittypes.RepoConfig) error {
	if len(repoConfig.URL) == 0 || !validate.IsURL(repoConfig.URL) {
		return httperrors.NewInvalidPayloadError("Invalid repository URL. Must correspond to a valid URL format")
	}

	return ValidateRepoAuthentication(repoConfig.Authentication)
}

func ValidateRepoAuthentication(auth *gittypes.GitAuthentication) error {
	if auth != nil && len(auth.Password) == 0 && auth.GitCredentialID == 0 {
		return httperrors.NewInvalidPayloadError("Invalid repository credentials. Password or GitCredentialID must be specified when authentication is enabled")
	}

	return nil
}
