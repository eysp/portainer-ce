import { EnvironmentId } from '@/react/portainer/environments/types';
import { ContainerId } from '@/react/docker/containers/types';
import { useAuthorizations } from '@/react/hooks/useUser';
import { dockerWebhookUrl } from '@/portainer/helpers/webhookHelper';
import { notifySuccess } from '@/portainer/services/notifications';
import { truncateLeftRight } from '@/portainer/filters/filters';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { useWebhooks } from '@/react/portainer/webhooks/useWebhooks';
import { useCreateWebhook } from '@/react/portainer/webhooks/useCreateWebhook';
import { useDeleteWebhook } from '@/react/portainer/webhooks/useDeleteWebhook';
import { WebhookType } from '@/react/portainer/webhooks/types';
import { RegistryId } from '@/react/portainer/registries/types/registry';

import { CopyButton } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

import { useCanRecreateContainer } from '../ContainerActionsSection/SecondaryActions/useCanRecreateContainer';

interface Props {
  containerId: ContainerId;
  environmentId: EnvironmentId;
  autoRemove: boolean;
  onSuccess?(): void;
  registryId?: RegistryId;
  partOfSwarmService: boolean;
}

export function WebhookRow({
  containerId,
  environmentId,
  autoRemove,
  registryId,
  onSuccess = () => {},
  partOfSwarmService,
}: Props) {
  const shouldDisplayWebhook = useCanRecreateContainer({
    autoRemove,
    partOfSwarmService,
  });
  const { authorized: canUpdate } = useAuthorizations([
    'DockerContainerUpdate',
  ]);
  const { authorized: canCreateWebhook } = useAuthorizations([
    'PortainerWebhookCreate',
  ]);
  const { authorized: canDeleteWebhook } = useAuthorizations([
    'PortainerWebhookDelete',
  ]);

  const webhooksQuery = useWebhooks(
    { endpointId: environmentId, resourceId: containerId },
    {
      enabled: canUpdate && shouldDisplayWebhook,
    }
  );

  const createWebhookMutation = useCreateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();

  const webhook = webhooksQuery.data?.[0];
  const webhookUrl = webhook ? dockerWebhookUrl(webhook.Token) : '';

  if (!shouldDisplayWebhook) {
    return null;
  }

  const webhookExists = !!webhook;
  const isDisabled =
    !shouldDisplayWebhook ||
    !canUpdate ||
    (webhookExists ? !canDeleteWebhook : !canCreateWebhook);

  function handleWebhookChange(enabled: boolean) {
    if (enabled && !webhookExists) {
      createWebhookMutation.mutate(
        {
          resourceId: containerId,
          environmentId,
          webhookType: WebhookType.DockerContainer,
          registryId,
        },
        {
          onSuccess: () => {
            notifySuccess('成功', 'Webhook 已成功创建');
            onSuccess();
          },
        }
      );
    } else if (!enabled && webhookExists) {
      deleteWebhookMutation.mutate(
        { webhookId: webhook.Id },
        {
          onSuccess: () => {
            notifySuccess('成功', 'Webhook 已成功删除');
            onSuccess();
          },
        }
      );
    }
  }

  return (
    <tr>
      <td>
        <SwitchField
          label="容器 Webhook"
          checked={webhookExists}
          disabled={isDisabled}
          onChange={handleWebhookChange}
          tooltip="用于自动重新创建此容器的 Webhook（或回调 URI）。向此回调 URI 发送 POST 请求（无需任何身份验证）会拉取关联镜像的最新版本并重新创建此容器。"
          data-cy="container-webhook-switch"
          fieldClass="flex items-center gap-2"
          labelClass="!m-0"
          featureId={FeatureId.CONTAINER_WEBHOOK}
        />
      </td>
      <td>
        {!!webhookUrl && (
          <div className="flex gap-2 items-center">
            <span className="text-muted">{truncateLeftRight(webhookUrl)}</span>
            <CopyButton
              copyText={webhookUrl}
              data-cy="container-webhook-copy-button"
            >
              复制链接
            </CopyButton>
          </div>
        )}
      </td>
    </tr>
  );
}
