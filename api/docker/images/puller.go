package images

import (
	"context"
	"io"

	"github.com/portainer/portainer/api/dataservices"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/rs/zerolog/log"
)

type Puller struct {
	client         *client.Client
	registryClient *RegistryClient
	dataStore      dataservices.DataStore
}

func NewPuller(client *client.Client, registryClient *RegistryClient, dataStore dataservices.DataStore) *Puller {
	return &Puller{
		client:         client,
		registryClient: registryClient,
		dataStore:      dataStore,
	}
}

func (puller *Puller) Pull(ctx context.Context, image Image) error {
	log.Debug().Str("image", image.FullName()).Msg("starting to pull the image")

	registryAuth, err := puller.registryClient.EncodedRegistryAuth(image)
	if err != nil {
		log.Debug().
			Str("image", image.FullName()).
			Err(err).
			Msg("failed to get an encoded registry auth via image, try to pull image without registry auth")
	}

	out, err := puller.client.ImagePull(ctx, image.FullName(), types.ImagePullOptions{
		RegistryAuth: registryAuth,
	})
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.ReadAll(out)

	return err
}
