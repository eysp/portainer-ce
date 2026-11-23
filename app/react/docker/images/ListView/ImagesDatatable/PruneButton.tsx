import { BrushCleaning, Check } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifySuccess, notifyError } from '@/portainer/services/notifications';
import { Authorized } from '@/react/hooks/useUser';
import { humanize } from '@/portainer/filters/filters';

import { LoadingButton } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { usePruneImagesMutation } from '../../queries/usePruneImagesMutation';
import { ImagesListResponse } from '../../queries/useImages';

import { confirmPruneImages } from './ConfirmPruneModal';

interface Props {
  images: ImagesListResponse[];
}

export function PruneButton({ images }: Props) {
  const environmentId = useEnvironmentId();
  const pruneMutation = usePruneImagesMutation(environmentId);

  const hasPrunableImages = images.some((image) => !image.used);

  const button = (
    <LoadingButton
      color="default"
      icon={hasPrunableImages ? BrushCleaning : Check}
      onClick={handlePrune}
      isLoading={pruneMutation.isLoading}
      loadingText="正在清理..."
      data-cy="image-pruneButton"
      disabled={!hasPrunableImages}
    >
      清理未使用的镜像
    </LoadingButton>
  );

  if (hasPrunableImages) {
    return (
      <Authorized authorizations="DockerImagePrune" adminOnlyCE>
        {button}
      </Authorized>
    );
  }

  return (
    <Authorized authorizations="DockerImagePrune" adminOnlyCE>
      <TooltipWithChildren message="没有可清理的未使用镜像">
        <span>{button}</span>
      </TooltipWithChildren>
    </Authorized>
  );

  async function handlePrune() {
    const result = await confirmPruneImages(images);

    if (!result) {
      return;
    }

    pruneMutation.mutate(
      { all: result.pruneAll, clearBuildCache: result.clearBuildCache },
      {
        onSuccess: ({ SpaceReclaimed, buildCacheError }) => {
          const message =
            SpaceReclaimed === 0
              ? '已释放 0 B - 镜像层可能仍被其他镜像使用，或仍在 Docker 构建缓存中。'
              : `已释放 ${humanize(SpaceReclaimed)}`;
          notifySuccess('镜像已清理', message);
          if (buildCacheError) {
            notifyError('清除 Docker 构建缓存失败', buildCacheError);
          }
        },
        onError: (error) => {
          notifyError('清理镜像失败', error);
        },
      }
    );
  }
}
