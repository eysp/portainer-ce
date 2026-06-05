package archive

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUnzipFile(t *testing.T) {
	dir := t.TempDir()
	/*
		Archive structure.
		├── 0
		│	├── 1
		│	│	└── 2.txt
		│	└── 1.txt
		└── 0.txt
	*/

	err := UnzipFile("./testdata/sample_archive.zip", dir)

	require.NoError(t, err)
	archiveDir := dir + "/sample_archive"
	assert.FileExists(t, filepath.Join(archiveDir, "0.txt"))
	assert.FileExists(t, filepath.Join(archiveDir, "0", "1.txt"))
	assert.FileExists(t, filepath.Join(archiveDir, "0", "1", "2.txt"))

}
