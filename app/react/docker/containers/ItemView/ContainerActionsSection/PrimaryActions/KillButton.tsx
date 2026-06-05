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
          notifySuccess('成功', '容器已成功终止');
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
        loadingText="终止中..."
        data-cy="kill-container-button"
        icon={Bomb}
      >
        终止
      </LoadingButton>
    </Authorized>
  );
}
