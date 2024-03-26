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
        通过 Portainer 或直接在集群中进行的任何对此堆栈或应用程序的本地更改都将被 git 仓库的内容覆盖，这可能导致服务中断。
      </TextTip>

      <FormControl label="Mechanism">
        <ButtonSelector
          size="small"
          options={[
            { value: 'Interval', label: 'Polling' },
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
              tooltip="如果启用，当通过 webhook 或轮询触发重新部署时，如果有新的已被您指定标签的镜像（例如可变的开发构建），它将被拉取并重新部署。如果您没有指定标签，或者将 'latest' 作为标签指定，则会拉取标签为 'latest' 的镜像并重新部署。"
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
          environmentType === 'KUBERNETES' ? 'Always apply manifest' : undefined
        }
        tooltip={
          environmentType === 'KUBERNETES' ? (
            <>
              <p>
                如果启用，当通过 webhook 或轮询触发重新部署时，即使 Portainer 检测到 git 仓库与上次 git 拉取时本地存储的内容没有差异，也会始终执行 kubectl apply。
              </p>
              <p>
                如果您希望 git 仓库成为真相的源头，并且对于直接对集群中的资源进行的更改被覆盖，那么这将非常有用。
              </p>
            </>
          ) : undefined
        }
      />
    </>
  );
}
