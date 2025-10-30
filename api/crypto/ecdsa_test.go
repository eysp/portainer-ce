package crypto

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCreateSignature(t *testing.T) {
	var s = NewECDSAService("secret")

	privKey, pubKey, err := s.GenerateKeyPair()
	require.NoError(t, err)
	require.Greater(t, len(privKey), 0)
	require.Greater(t, len(pubKey), 0)

	m := "test message"
	r, err := s.CreateSignature(m)
	require.NoError(t, err)
	require.NotEqual(t, r, m)
	require.Greater(t, len(r), 0)
}
