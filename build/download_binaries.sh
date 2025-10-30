#!/usr/bin/env bash
set -euo pipefail

PLATFORM=${1:-"linux"}
ARCH=${2:-"amd64"}

BINARY_VERSION_FILE="./binary-version.json"

dockerVersion=$(jq -r '.docker' < "${BINARY_VERSION_FILE}")
mingitVersion=$(jq -r '.mingit' < "${BINARY_VERSION_FILE}")

mkdir -p dist

echo "Checking and downloading binaries for docker ${dockerVersion}, and mingit ${mingitVersion} (Windows only)"

# Determine the binary file names based on the platform
dockerBinary="dist/docker"

if [ "$PLATFORM" == "windows" ]; then
    dockerBinary="dist/docker.exe"
fi

# Check and download docker binary
if [ ! -f "$dockerBinary" ]; then
    echo "Downloading docker binary..."
    /usr/bin/env bash ./build/download_docker_binary.sh "$PLATFORM" "$ARCH" "$dockerVersion"
else
    echo "Docker binary already exists, skipping download."
fi

# Check and download mingit binary only for Windows
if [ "$PLATFORM" == "windows" ]; then
    if [ ! -f "dist/mingit" ]; then
        echo "Downloading mingit binary..."
        /usr/bin/env bash ./build/download_mingit_binary.sh "$PLATFORM" "$ARCH" "$mingitVersion"
    else
        echo "Mingit binary already exists, skipping download."
    fi
fi
