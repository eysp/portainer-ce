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
        通过 Portainer 或直接在集群中对该堆栈或应用程序所做的任何更改将被 Git 仓库内容覆盖，这可能会导致服务中断。
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
              featureId={FeatureId.STACK_PULL_IMAGE}
              checked={value.ForcePullImage || false}
              label="重新拉取镜像"
              labelClass="col-sm-3 col-lg-2"
              tooltip="如果启用，当通过 webhook 或轮询触发重新部署时，如果存在指定标签的新镜像（例如可变的开发构建），则会拉取并重新部署该镜像。如果未指定标签，或指定了 'latest' 作为标签，则会拉取并重新部署带有 'latest' 标签的镜像。"
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
                如果启用，当通过 webhook 或轮询触发重新部署时，始终执行 kubectl apply，
                即使 Portainer 检测到 git 仓库与上次 git 拉取时存储在本地的内容没有区别。
              </p>
              <p>
                如果你希望 git 仓库作为事实来源，并且可以接受直接对集群中资源所做的更改被覆盖，则此功能非常有用。
              </p>
            </>
          ) : undefined
        }
      />
    </>
  );
}
