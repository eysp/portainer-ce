import { useField } from 'formik';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { FormControl } from '@@/form-components/FormControl';
import { SwitchField } from '@@/form-components/SwitchField';
import { Input } from '@@/form-components/Input';

import { useToggledValue } from '../useToggledValue';

export function KubeNoteMinimumCharacters() {
  const [{ value }, { error }, { setValue }] = useField<number>(
    'globalDeploymentOptions.minApplicationNoteLength'
  );
  const [isEnabled, setIsEnabled] = useToggledValue(
    'globalDeploymentOptions.minApplicationNoteLength',
    'globalDeploymentOptions.requireNoteOnApplications'
  );

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="要求应用程序备注"
            checked={isEnabled}
            name="toggle_requireNoteOnApplications"
            onChange={(value) => setIsEnabled(value)}
            featureId={FeatureId.K8S_REQUIRE_NOTE_ON_APPLICATIONS}
            labelClass="col-sm-3 col-lg-2"
            tooltip={`${
              isBE ? '' : 'BE 允许在添加/编辑应用程序时输入备注。 '
            }启用此选项将强制在添加/编辑应用程序时输入备注（并防止在应用程序详情中完全清除备注）。`}
          />
        </div>
      </div>
      {isEnabled && (
        <FormControl
          label={
            <span className="pl-4">
              备注必须包含的最小字符数
            </span>
          }
          errors={error}
        >
          <Input
            name="minNoteLength"
            type="number"
            placeholder="50"
            min="1"
            max="9999"
            value={value}
            onChange={(e) => setValue(e.target.valueAsNumber)}
            className="w-1/4"
          />
        </FormControl>
      )}
    </>
  );
}
