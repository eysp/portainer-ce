package filesystem

import (
	"os"
	"path"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_WriteFile_CanStoreContentInANewFile(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFilePath := path.Join(tmpDir, "dummy")

	content := []byte("content")
	err := WriteToFile(tmpFilePath, content)
	require.NoError(t, err)

	fileContent, _ := os.ReadFile(tmpFilePath)
	assert.Equal(t, content, fileContent)
}

func Test_WriteFile_CanOverwriteExistingFile(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFilePath := path.Join(tmpDir, "dummy")

	err := WriteToFile(tmpFilePath, []byte("content"))
	require.NoError(t, err)

	content := []byte("new content")
	err = WriteToFile(tmpFilePath, content)
	require.NoError(t, err)

	fileContent, _ := os.ReadFile(tmpFilePath)
	assert.Equal(t, content, fileContent)
}

func Test_WriteFile_CanWriteANestedPath(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFilePath := path.Join(tmpDir, "dir", "sub-dir", "dummy")

	content := []byte("content")
	err := WriteToFile(tmpFilePath, content)
	require.NoError(t, err)

	fileContent, _ := os.ReadFile(tmpFilePath)
	assert.Equal(t, content, fileContent)
}
