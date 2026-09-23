import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { InformationPanel } from '@@/InformationPanel';
import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

import { confirmDisassociate } from '../ConfirmDisassociateModel';

import { useDisassociateEnvironment } from './useDisassociateEnvironment';

interface EdgeInformationPanelProps {
  environmentId: EnvironmentId;
  edgeKey: string;
  edgeId: string;
  platformName: string;
  onSuccess?: () => void;
}

export function EdgeInformationPanel({
  environmentId,
  edgeKey,
  edgeId,
  platformName,
  onSuccess,
}: EdgeInformationPanelProps) {
  const disassociateMutation = useDisassociateEnvironment(environmentId);

  let edgeServerAddress = '';
  let edgeTunnelAddress = '';
  try {
    const decoded = atob(edgeKey + '='.repeat((4 - (edgeKey.length % 4)) % 4));
    [edgeServerAddress = '', edgeTunnelAddress = ''] = decoded.split('|');
  } catch {
    // malformed edge key — leave addresses empty
  }

  async function handleDisassociate() {
    const confirmed = await confirmDisassociate();
    if (confirmed) {
      disassociateMutation.mutate(undefined, {
        onSuccess() {
          notifySuccess(
            '环境已解除关联',
            '环境已成功解除关联'
          );
          onSuccess?.();
        },
      });
    }
  }

  return (
    <InformationPanel title="边缘环境信息">
      <div className="text-muted small flex flex-col gap-2">
        <TextTip>
          此边缘环境已与一个边缘设备关联（{platformName}）。
        </TextTip>
        <p>
          边缘密钥 (Edge key): <code>{edgeKey}</code>
        </p>
        <p>
          Portainer API 服务器: <code>{edgeServerAddress}</code>
        </p>
        <p>
          Portainer 隧道地址: <code>{edgeTunnelAddress}</code>
        </p>
        <p>
          边缘标识符 (Edge ID): <code>{edgeId}</code>
        </p>
        <p>
          <LoadingButton
            size="small"
            color="primary"
            isLoading={disassociateMutation.isLoading}
            loadingText="正在解除关联..."
            onClick={handleDisassociate}
            data-cy="disassociate-environment-button"
          >
            解除关联
          </LoadingButton>
        </p>
      </div>
    </InformationPanel>
  );
}
