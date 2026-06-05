import { useFormikContext } from 'formik';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isLimitedToBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';

import { KubeNoteMinimumCharacters } from './KubeNoteMinimumCharacters';
import { FormValues } from './types';

export function DeploymentOptionsSection() {
  const {
    values: { globalDeploymentOptions: values },
    setFieldValue,
  } = useFormikContext<FormValues>();

  const limitedFeature = isLimitedToBE(FeatureId.ENFORCE_DEPLOYMENT_OPTIONS);
  return (
    <FormSection title="部署选项">
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="强制执行基于代码的部署"
            data-cy="kube-settings-enforce-code-based-deployment"
            checked={values.hideAddWithForm}
            name="toggle_hideAddWithForm"
            featureId={FeatureId.ENFORCE_DEPLOYMENT_OPTIONS}
            onChange={(value) => handleToggleAddWithForm(value)}
            labelClass="col-sm-3 col-lg-2"
            tooltip="Hides the 'Add with form' buttons and prevents adding/editing of resources via forms"
          />
        </div>
      </div>
      {values.hideAddWithForm && (
        <div className="form-group flex flex-col gap-y-1">
          <div className="col-sm-12">
            <SwitchField
              label="允许使用 Web 编辑器和自定义模板"
              data-cy="kube-settings-allow-web-editor-and-custom-template-use"
              checked={!values.hideWebEditor}
              name="toggle_hideWebEditor"
              onChange={(value) =>
                setFieldValue('globalDeploymentOptions.hideWebEditor', !value)
              }
              labelClass="col-sm-2 !pl-4"
            />
          </div>
          <div className="col-sm-12">
            <SwitchField
              label="允许通过 URL 指定清单"
              data-cy="kube-settings-allow-specifying-of-a-manifest-via-a-url"
              checked={!values.hideFileUpload}
              name="toggle_hideFileUpload"
              onChange={(value) =>
                setFieldValue('globalDeploymentOptions.hideFileUpload', !value)
              }
              labelClass="col-sm-2 !pl-4"
            />
          </div>
        </div>
      )}
      {!limitedFeature && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              label="允许按环境覆盖"
              data-cy="kube-settings-allow-per-environment-override"
              checked={values.perEnvOverride}
              onChange={(value) =>
                setFieldValue('globalDeploymentOptions.perEnvOverride', value)
              }
              name="toggle_perEnvOverride"
              labelClass="col-sm-3 col-lg-2"
              tooltip="允许在每个环境的集群设置屏幕中覆盖部署选项"
            />
          </div>
        </div>
      )}

      <KubeNoteMinimumCharacters />

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="允许在 Kubernetes 环境中使用堆栈功能"
            data-cy="kube-settings-allow-stacks-functionality"
            checked={!values.hideStacksFunctionality}
            onChange={(value) =>
              setFieldValue(
                'globalDeploymentOptions.hideStacksFunctionality',
                !value
              )
            }
            name="toggle_stacksFunctionality"
            labelClass="col-sm-3 col-lg-2"
            tooltip="这允许您将应用程序/工作负载分组到单个‘堆栈’中，然后查看或删除整个堆栈。如果禁用，堆栈功能将不会在 UI 中显示。"
          />
        </div>
      </div>
    </FormSection>
  );

  async function handleToggleAddWithForm(checked: boolean) {
    await setFieldValue('globalDeploymentOptions.hideWebEditor', checked);
    await setFieldValue('globalDeploymentOptions.hideFileUpload', checked);
    await setFieldValue('globalDeploymentOptions.hideAddWithForm', checked);
  }
}
