import { Play } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { LoadingButton } from '@@/buttons';

import { ContainerId } from '../../../types';
import { useStartContainer } from '../queries/useStartContainer';

interface StartButtonProps {
  environmentId: EnvironmentId;
  containerId: ContainerId;
  nodeName?: string;
  isRunning: boolean;
  isPortainer: boolean;
  onSuccess?(): void;
}

export function StartButton({
  environmentId,
  containerId,
  nodeName,
  isRunning,
  isPortainer,
  onSuccess = () => {},
}: StartButtonProps) {
  const startMutation = useStartContainer();

  function handleStart() {
    startMutation.mutate(
      { environmentId, containerId, nodeName },
      {
        onSuccess() {
          notifySuccess('成功', '容器已成功启动');
          onSuccess();
        },
      }
    );
  }

  return (
    <Authorized authorizations="DockerContainerStart">
      <LoadingButton
        color="light"
        size="small"
        onClick={handleStart}
        disabled={isRunning || isPortainer}
        isLoading={startMutation.isLoading}
        loadingText="启动中..."
        data-cy="start-container-button"
        icon={Play}
      >
        启动
      </LoadingButton>
    </Authorized>
  );
}
