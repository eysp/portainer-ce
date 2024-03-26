import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { ArrayError } from '../InputList/InputList';

import { Value } from './types';
import { EnvironmentVariablesFieldset } from './EnvironmentVariablesFieldset';

export function EnvironmentVariablesPanel({
  explanation,
  onChange,
  values,
  showHelpMessage,
  errors,
}: {
  explanation?: string;
  values: Value;
  onChange(value: Value): void;
  showHelpMessage?: boolean;
  errors?: ArrayError<Value>;
}) {
  return (
    <FormSection title="环境变量">
      <div className="form-group">
        {!!explanation && (
          <div className="col-sm-12 environment-variables-panel--explanation">
            {explanation}
          </div>
        )}

        <EnvironmentVariablesFieldset
          values={values}
          onChange={onChange}
          errors={errors}
        />

        {showHelpMessage && (
          <div className="col-sm-12">
            <TextTip color="blue" inline={false}>
              环境变量的更改将在手动重新部署或通过 Webhook 触发的情况下才会生效。
            </TextTip>
          </div>
        )}
      </div>
    </FormSection>
  );
}
