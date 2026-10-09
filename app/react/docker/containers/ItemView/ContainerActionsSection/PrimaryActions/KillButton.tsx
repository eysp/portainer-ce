import { Bomb } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { LoadingButton } from '@@/buttons';

import { ContainerId } from '../../../types';
import { useKillContainer } from '../queries/useKillContainer';

interface KillButtonProps {
  environmentId: EnvironmentId;
  containerId: ContainerId;
  nodeName?: string;
  isRunning: boolean;
  isPortainer: boolean;
  onSuccess?(): void;
}

export function KillButton({
  environmentId,
  containerId,
  nodeName,
  isRunning,
  isPortainer,
  onSuccess = () => {},
}: KillButtonProps) {
  const killMutation = useKillContainer();

  function handleKill() {
    killMutation.mutate(
      { environmentId, containerId, nodeName },
      {
        onSuccess() {
          notifySuccess('成功', '容器已强制终止');
          onSuccess();
        },
      }
    );
  }

  return (
    <Authorized authorizations="DockerContainerKill">
      <LoadingButton
        color="light"
        size="small"
        onClick={handleKill}
        disabled={!isRunning || isPortainer}
        isLoading={killMutation.isLoading}
        loadingText="正在终止..."
        data-cy="kill-container-button"
        icon={Bomb}
      >
        强制终止
      </LoadingButton>
    </Authorized>
  );
}
