package fips

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestInitFIPS(t *testing.T) {
	InitFIPS(false)

	require.False(t, FIPSMode())

	require.True(t, CanTLSSkipVerify())
}
