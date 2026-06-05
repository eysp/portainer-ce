import { Trash2 } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { confirmContainerDeletion } from '@/react/docker/containers/common/confirm-container-delete-modal';
import { notifySuccess } from '@/portainer/services/notifications';

import { LoadingButton } from '@@/buttons';

import { ContainerId } from '../../../types';
import { useRemoveContainer } from '../queries/useRemoveContainer';

interface RemoveButtonProps {
  environmentId: EnvironmentId;
  containerId: ContainerId;
  nodeName?: string;
  isRunning: boolean;
  isPortainer: boolean;
}

export function RemoveButton({
  environmentId,
  containerId,
  nodeName,
  isRunning,
  isPortainer,
}: RemoveButtonProps) {
  const removeMutation = useRemoveContainer();

  async function handleRemove() {
    const title = isRunning
      ? '您即将删除一个正在运行的容器。'
      : '您即将删除一个容器。';

    const result = await confirmContainerDeletion(title);

    if (!result) {
      return;
    }

    removeMutation.mutate(
      {
        environmentId,
        containerId,
        nodeName,
        removeVolumes: result.removeVolumes,
      },
      {
        onSuccess() {
          notifySuccess('成功', '容器已成功删除');
        },
      }
    );
  }

  return (
    <Authorized authorizations="DockerContainerDelete">
      <LoadingButton
        color="dangerlight"
        size="small"
        onClick={handleRemove}
        disabled={isPortainer}
        isLoading={removeMutation.isLoading}
        loadingText="删除中..."
        data-cy="remove-container-button"
        icon={Trash2}
      >
        删除
      </LoadingButton>
    </Authorized>
  );
}
