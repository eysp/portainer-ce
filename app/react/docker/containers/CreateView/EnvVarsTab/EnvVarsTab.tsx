import {
  EnvVarValues,
  EnvironmentVariablesPanel,
} from '@@/form-components/EnvironmentVariablesFieldset';
import { ArrayError } from '@@/form-components/InputList/InputList';

export function EnvVarsTab({
  values,
  onChange,
  errors,
}: {
  values: EnvVarValues;
  onChange(value: EnvVarValues): void;
  errors?: ArrayError<EnvVarValues>;
}) {
  return (
    <div className="form-group">
      <EnvironmentVariablesPanel
        values={values}
        explanation="这些环境变量将在容器部署时生效并注入容器中"
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );

  function handleChange(values: EnvVarValues) {
    onChange(values);
  }
}
