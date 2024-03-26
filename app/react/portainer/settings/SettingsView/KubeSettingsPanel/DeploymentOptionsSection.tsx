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
        label="强制代码部署"
        checked={values.hideAddWithForm}
        name="toggle_hideAddWithForm"
        featureId={FeatureId.ENFORCE_DEPLOYMENT_OPTIONS}
        onChange={(value) => handleToggleAddWithForm(value)}
        labelClass="col-sm-3 col-lg-2"
        tooltip="隐藏“使用表单添加”按钮，并阻止通过表单添加/编辑资源"
      />
    </div>
  </div>
  {values.hideAddWithForm && (
    <div className="form-group flex flex-col gap-y-1">
      <div className="col-sm-12">
        <SwitchField
          label="允许使用 Web 编辑器和自定义模板"
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
          label="允许每个环境的覆盖"
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
</FormSection>
  );

  async function handleToggleAddWithForm(checked: boolean) {
    await setFieldValue('globalDeploymentOptions.hideWebEditor', checked);
    await setFieldValue('globalDeploymentOptions.hideFileUpload', checked);
    await setFieldValue('globalDeploymentOptions.hideAddWithForm', checked);
  }
}
