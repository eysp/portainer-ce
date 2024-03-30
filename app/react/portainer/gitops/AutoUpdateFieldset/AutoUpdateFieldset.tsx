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
            tooltip="启用后，每次轮询间隔或 Webhook 调用时，如果 git 仓库与上次 git 拉取时存储的内容不同，则部署更改。"
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
            我们将“自动更新”重命名，以更好地与行业术语保持一致，
            并为所有用户明确其目的。最初在 GitOps 刚兴起之际选择
            了这个名称，现在名称已经改变，但功能保持不变。
            GitOps 迅速成为管理基础架构和应用程序变更的革命性方
            法，我们希望确保我们的平台反映出行业最新的进展。
          </p>
        }
        header="了解 'GitOps 更新'：之前称为自动更新"
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
