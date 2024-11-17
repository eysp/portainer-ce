import { FormikErrors } from 'formik';

import { AutoUpdateModel } from '@/react/portainer/gitops/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { InsightsBox } from '@@/InsightsBox';

import { AutoUpdateSettings } from './AutoUpdateSettings';

export function AutoUpdateFieldset({
  value,
  onChange,
  environmentType,
  isForcePullVisible = true,
  errors,
  baseWebhookUrl,
  webhookId,
  webhooksDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: AutoUpdateModel) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  isForcePullVisible?: boolean;
  errors?: FormikErrors<AutoUpdateModel>;
  baseWebhookUrl: string;
  webhookId: string;
  webhooksDocs?: string;
}) {
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="autoUpdate"
            checked={value.RepositoryAutomaticUpdates}
            label="GitOps 更新"
            tooltip="启用后，在每次轮询间隔或 webhook 调用时，如果 git 仓库与上次 git 拉取时存储在本地的内容不同，则会部署这些更改。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) =>
              handleChange({ RepositoryAutomaticUpdates: value })
            }
          />
        </div>
      </div>

      <InsightsBox
        content={
          <p>
            我们将“自动更新”更名为更符合行业术语的名称，以便为所有用户更清晰地说明其用途。
            该名称最初是在 GitOps 早期出现时选择的，虽然名称有所变化，但功能保持不变。GitOps 迅速成为一种革命性的基础设施和应用程序管理方法，
            我们希望确保我们的平台能够反映行业的最新进展。
          </p>
        }
        header="介绍 ‘GitOps 更新’ : 前身为 自动更新"
        insightCloseId="rename-gitops-updates"
        className="mb-3"
      />

      {value.RepositoryAutomaticUpdates && (
        <AutoUpdateSettings
          webhookId={webhookId}
          baseWebhookUrl={baseWebhookUrl}
          value={value}
          onChange={handleChange}
          environmentType={environmentType}
          showForcePullImage={isForcePullVisible}
          errors={errors}
          webhookDocs={webhooksDocs}
        />
      )}
    </>
  );

  function handleChange(newValues: Partial<AutoUpdateModel>) {
    onChange({ ...value, ...newValues });
  }
}
