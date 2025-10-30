package sdk

import (
	"os"
	"testing"

	"github.com/portainer/portainer/pkg/libhelm/options"
	"github.com/portainer/portainer/pkg/libhelm/test"
	"github.com/stretchr/testify/require"
)

func TestUpgrade(t *testing.T) {
	test.EnsureIntegrationTest(t)
	is := require.New(t)

	// Create a new SDK package manager
	hspm := NewHelmSDKPackageManager()

	t.Run("when no release exists, the chart should be installed", func(t *testing.T) {
		// SDK equivalent of: helm upgrade --install test-new-nginx --repo https://kubernetes.github.io/ingress-nginx ingress-nginx
		upgradeOpts := options.InstallOptions{
			Name:      "test-new-nginx",
			Namespace: "default",
			Chart:     "ingress-nginx",
			Repo:      "https://kubernetes.github.io/ingress-nginx",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: upgradeOpts.Name,
		})

		release, err := hspm.Upgrade(upgradeOpts)
		is.NoError(err, "should successfully install release via upgrade")
		is.NotNil(release, "should return non-nil release")
		defer hspm.Uninstall(options.UninstallOptions{
			Name: upgradeOpts.Name,
		})

		is.Equal(upgradeOpts.Name, release.Name, "release name should match")
		is.Equal(1, release.Version, "release version should be 1 for new install")
		is.NotEmpty(release.Manifest, "release manifest should not be empty")

		// Cleanup
		defer hspm.Uninstall(options.UninstallOptions{
			Name: upgradeOpts.Name,
		})
	})

	t.Run("when release exists, the chart should be upgraded", func(t *testing.T) {
		// First install a release
		installOpts := options.InstallOptions{
			Name:      "test-upgrade-nginx",
			Chart:     "ingress-nginx",
			Namespace: "default",
			Repo:      "https://kubernetes.github.io/ingress-nginx",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		release, err := hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully install release")
		is.NotNil(release, "should return non-nil release")
		defer hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		// Upgrade the release with the same options
		upgradedRelease, err := hspm.Upgrade(installOpts)

		is.NoError(err, "should successfully upgrade release")
		is.NotNil(upgradedRelease, "should return non-nil release")
		is.Equal("test-upgrade-nginx", upgradedRelease.Name, "release name should match")
		is.Equal(2, upgradedRelease.Version, "release version should be incremented to 2")
		is.NotEmpty(upgradedRelease.Manifest, "release manifest should not be empty")
	})

	t.Run("should be able to upgrade with override values", func(t *testing.T) {
		// First install a release
		installOpts := options.InstallOptions{
			Name:      "test-values-nginx",
			Chart:     "ingress-nginx",
			Namespace: "default",
			Repo:      "https://kubernetes.github.io/ingress-nginx",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		release, err := hspm.Upgrade(installOpts) // Cleanup
		is.NoError(err, "should successfully install release")
		is.NotNil(release, "should return non-nil release")
		defer hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		// Create values file
		values, err := test.CreateValuesFile("service:\n  port:  8083")
		is.NoError(err, "should create a values file")
		defer os.Remove(values)

		// Now upgrade with values
		upgradeOpts := options.InstallOptions{
			Name:       "test-values-nginx",
			Chart:      "ingress-nginx",
			Namespace:  "default",
			Repo:       "https://kubernetes.github.io/ingress-nginx",
			ValuesFile: values,
		}

		upgradedRelease, err := hspm.Upgrade(upgradeOpts)

		is.NoError(err, "should successfully upgrade release with values")
		is.NotNil(upgradedRelease, "should return non-nil release")
		is.Equal("test-values-nginx", upgradedRelease.Name, "release name should match")
		is.Equal(2, upgradedRelease.Version, "release version should be incremented to 2")
		is.NotEmpty(upgradedRelease.Manifest, "release manifest should not be empty")
	})

	t.Run("should give an error if the override values are invalid", func(t *testing.T) {
		// First install a release
		installOpts := options.InstallOptions{
			Name:      "test-invalid-values",
			Chart:     "ingress-nginx",
			Namespace: "default",
			Repo:      "https://kubernetes.github.io/ingress-nginx",
		}

		// Ensure the release doesn't exist before test
		hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		release, err := hspm.Upgrade(installOpts)
		is.NoError(err, "should successfully install release")
		is.NotNil(release, "should return non-nil release")
		defer hspm.Uninstall(options.UninstallOptions{
			Name: installOpts.Name,
		})

		// Create invalid values file
		values, err := test.CreateValuesFile("this is not valid yaml")
		is.NoError(err, "should create a values file")
		defer os.Remove(values)

		// Now upgrade with invalid values
		upgradeOpts := options.InstallOptions{
			Name:       "test-invalid-values",
			Chart:      "ingress-nginx",
			Namespace:  "default",
			Repo:       "https://kubernetes.github.io/ingress-nginx",
			ValuesFile: values,
		}

		_, err = hspm.Upgrade(upgradeOpts)

		is.Error(err, "should return error with invalid values")
	})

	t.Run("should return error when name is not provided", func(t *testing.T) {
		upgradeOpts := options.InstallOptions{
			Chart:     "ingress-nginx",
			Namespace: "default",
			Repo:      "https://kubernetes.github.io/ingress-nginx",
		}

		_, err := hspm.Upgrade(upgradeOpts)

		is.Error(err, "should return an error when name is not provided")
		is.Equal("name is required for helm release upgrade", err.Error(), "should return correct error message")
	})
}
