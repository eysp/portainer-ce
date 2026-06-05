package errorlist

import (
	"errors"
	"strings"
)

// Combine a slice of errors into a single error
// to use this, generate errors by appending to errorList in a loop, then return combine(errorList)
func Combine(errorList []error) error {
	if len(errorList) == 0 {
		return nil
	}

	var errorMsg strings.Builder
	_, _ = errorMsg.WriteString("Multiple errors occurred:")
	for _, err := range errorList {
		_, _ = errorMsg.WriteString("\n" + err.Error())
	}

	return errors.New(errorMsg.String())
}
