package testutils

import (
	"os"
)

// CreateValuesFile creates a temporary file with the given content for testing
func CreateValuesFile(values string) (string, error) {
	file, err := os.CreateTemp("", "helm-values")
	if err != nil {
		return "", err
	}

	_, err = file.WriteString(values)
	if err != nil {
		file.Close()
		return "", err
	}

	err = file.Close()
	if err != nil {
		return "", err
	}

	return file.Name(), nil
}
