import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { type AutoUpdateModel } from '@/react/portainer/gitops/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

import { ForceDeploymentSwitch } from './ForceDeploymentSwitch';
import { WebhookSettings } from './WebhookSettings';

export function AutoUpdateSettings({
  value,
  onChange,
  environmentType,
  showForcePullImage,
  baseWebhookUrl,
  webhookId,
  webhookDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: Partial<AutoUpdateModel>) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  showForcePullImage: boolean;
  baseWebhookUrl: string;
  webhookId: string;
  webhookDocs?: string;
}) {
  return (
    <>
      <WebhookSettings
        baseUrl={baseWebhookUrl}
        value={webhookId}
        docsLink={webhookDocs}
      />

      <TextTip color="orange" className="mb-2">
        任何通过 Portainer 本地或直接在集群中对此堆栈或应用程序所做的更改都将被 git 仓库内容覆盖，这可能会导致服务中断。
      </TextTip>

      {showForcePullImage && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              name="forcePullImage"
              data-cy="gitops-force-pull-image-switch"
              featureId={FeatureId.STACK_PULL_IMAGE}
              checked={value.ForcePullImage || false}
              label="重新拉取镜像"
              labelClass="col-sm-3 col-lg-2"
              tooltip="如果启用，当通过 Webhook 或轮询触发重新部署时，如果存在具有您指定标签（例如可变的开发构建版本）的较新镜像，则拉取并重新部署该镜像。如果您未指定标签，或指定了“latest”作为标签，则拉取并重新部署标签为“latest”的镜像。"
              onChange={(value) => onChange({ ForcePullImage: value })}
            />
          </div>
        </div>
      )}

      <ForceDeploymentSwitch
        checked={value.RepositoryAutomaticUpdatesForce || false}
        onChange={(value) =>
          onChange({ RepositoryAutomaticUpdatesForce: value })
        }
        label={
          environmentType === 'KUBERNETES' ? '始终应用 Manifest' : undefined
        }
        tooltip={
          environmentType === 'KUBERNETES' ? (
            <>
              <p>
                如果启用，当通过 Webhook 或轮询触发重新部署时，即使 Portainer 检测到 git 仓库内容和上次拉取时本地存储的内容没有差异，也会始终执行 kubectl apply。
              </p>
              <p>
                如果您希望 git 仓库作为真实来源，并且能够接受直接在集群中修改资源的内容被覆盖，则此选项非常有用。
              </p>
            </>
          ) : (
            <p>
              如果启用，当通过 Webhook 或轮询触发重新部署时，即使 Portainer 检测到 git 仓库内容和上次拉取时本地存储的内容没有差异，堆栈也会始终重新部署。
            </p>
          )
        }
      />
    </>
  );
}
