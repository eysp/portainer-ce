package sdk

import (
	"testing"

	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/test"
	"github.com/stretchr/testify/assert"
)

func TestRollback(t *testing.T) {
	test.EnsureIntegrationTest(t)
	is := assert.New(t)

	// Create a new SDK package manager
	hspm := NewHelmSDKPackageManager()

	t.Run("should return error when name is not provided", func(t *testing.T) {
		rollbackOpts := options.RollbackOptions{
			Namespace: "default",
		}

		_, err := hspm.Rollback(rollbackOpts)

		is.Error(err, "should return an error when name is not provided")
		is.Equal("name is required for helm release rollback", err.Error(), "should return correct error message")
	})

	t.Run("should return error when release doesn't exist", func(t *testing.T) {
		rollbackOpts := options.RollbackOptions{
			Name:      "non-existent-release",
			Namespace: "default",
		}

		_, err := hspm.Rollback(rollbackOpts)

		is.Error(err, "should return an error when release doesn't exist")
	})

	t.Run("should successfully rollback to previous revision", func(t *testing.T) {
		// First install a release
		installOpts := options.InstallOptions{
			Name:      "hello-world",
			Chart:     "hello-world",
			Namespace: "default",
			Repo:      "https://helm.github.io/examples",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		// Install first version
		release, err := hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully install release")
		is.Equal(1, release.Version, "first version should be 1")

		// Upgrade to second version
		_, err = hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully upgrade release")

		// Rollback to first version
		rollbackOpts := options.RollbackOptions{
			Name:      installOpts.Name,
			Namespace: "default",
			Version:   0, // Previous revision
		}

		rolledBackRelease, err := hspm.Rollback(rollbackOpts)
		defer hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		is.NoError(err, "should successfully rollback release")
		is.NotNil(rolledBackRelease, "should return non-nil release")
		is.Equal(3, rolledBackRelease.Version, "version should be incremented to 3")
	})

	t.Run("should successfully rollback to specific revision", func(t *testing.T) {
		// First install a release
		installOpts := options.InstallOptions{
			Name:      "hello-world",
			Chart:     "hello-world",
			Namespace: "default",
			Repo:      "https://helm.github.io/examples",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		// Install first version
		release, err := hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully install release")
		is.Equal(1, release.Version, "first version should be 1")

		// Upgrade to second version
		_, err = hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully upgrade release")

		// Upgrade to third version
		_, err = hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully upgrade release again")

		// Rollback to first version
		rollbackOpts := options.RollbackOptions{
			Name:      installOpts.Name,
			Namespace: "default",
			Version:   1, // Specific revision
		}

		rolledBackRelease, err := hspm.Rollback(rollbackOpts)
		defer hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		is.NoError(err, "should successfully rollback to specific revision")
		is.NotNil(rolledBackRelease, "should return non-nil release")
		is.Equal(4, rolledBackRelease.Version, "version should be incremented to 4")
	})
}
