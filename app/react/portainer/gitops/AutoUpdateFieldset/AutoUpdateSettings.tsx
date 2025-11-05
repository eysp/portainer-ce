import { FormikErrors } from 'formik';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { type AutoUpdateModel } from '@/react/portainer/gitops/types';

import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { FormControl } from '@@/form-components/FormControl';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

import { ForceDeploymentSwitch } from './ForceDeploymentSwitch';
import { IntervalField } from './IntervalField';
import { WebhookSettings } from './WebhookSettings';

export function AutoUpdateSettings({
  value,
  onChange,
  environmentType,
  showForcePullImage,
  errors,
  baseWebhookUrl,
  webhookId,
  webhookDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: Partial<AutoUpdateModel>) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  showForcePullImage: boolean;
  errors?: FormikErrors<AutoUpdateModel>;
  baseWebhookUrl: string;
  webhookId: string;
  webhookDocs?: string;
}) {
  return (
    <>
      <TextTip color="orange" className="mb-2">
        通过 Portainer 在本地或直接在集群中对堆栈或应用程序所做的任何更改都将被 Git 仓库内容覆盖，这可能会导致服务中断。
      </TextTip>

      <FormControl label="机制">
        <ButtonSelector
          size="small"
          options={[
            { value: 'Interval', label: '轮询' },
            { value: 'Webhook', label: 'Webhook' },
          ]}
          value={value.RepositoryMechanism || 'Interval'}
          onChange={(value) => onChange({ RepositoryMechanism: value })}
        />
      </FormControl>

      {value.RepositoryMechanism === 'Webhook' && (
        <WebhookSettings
          baseUrl={baseWebhookUrl}
          value={webhookId}
          docsLink={webhookDocs}
        />
      )}

      {value.RepositoryMechanism === 'Interval' && (
        <IntervalField
          value={value.RepositoryFetchInterval || ''}
          onChange={(value) => onChange({ RepositoryFetchInterval: value })}
          errors={errors?.RepositoryFetchInterval}
        />
      )}

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
              tooltip="如果启用，则当通过 Webhook 或轮询触发重新部署时，如果有您指定的标签（例如可变的开发构建）的较新镜像，将拉取并重新部署。如果您未指定标签，或指定了 'latest' 作为标签，则将拉取并重新部署带有 'latest' 标签的镜像。启用相对路径后，当挂载的文件（不仅仅是 compose 文件）更改时也会重新部署。"
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
          environmentType === 'KUBERNETES' ? '始终应用清单' : undefined
        }
        tooltip={
          environmentType === 'KUBERNETES' ? (
            <>
              <p>
                如果启用，则当通过 Webhook 或轮询触发重新部署时，即使 Portainer 检测到 Git 仓库与上次 Git 拉取时本地存储的内容没有差异，也会始终执行 kubectl apply。
              </p>
              <p>
                如果您希望 Git 仓库成为单一事实来源，并且可以接受直接对集群中的资源所做的更改被覆盖，这很有用。
              </p>
            </>
          ) : (
            <p>
              如果启用，则当通过 Webhook 或轮询触发重新部署时，堆栈行为取决于堆栈类型：
              <br />
              <strong>常规堆栈：</strong> 每当触发时重新部署，不检查 docker-compose 文件更改
              <br />
              <strong>边缘堆栈：</strong> 仅当 Git 仓库中的 docker-compose 文件发生更改时重新部署。更改无关文件或挂载文件（通过相对路径）的提交不会触发重新部署。目前，此选项不会更改重新部署行为，并且它仍然是一个临时解决方案，直到稍后添加更完整的行为。
            </p>
          )
        }
      />
    </>
  );
}
