import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { FormControl } from '@@/form-components/FormControl';

import { RestartPolicy } from './types';

export function RestartPolicyTab({
  values,
  onChange,
}: {
  values: RestartPolicy;
  onChange: (values: RestartPolicy) => void;
}) {
  return (
    <FormControl label="重启策略">
      <ButtonSelector
        options={[
          { label: '从不', value: RestartPolicy.No },
          { label: '总是', value: RestartPolicy.Always },
          { label: '失败时', value: RestartPolicy.OnFailure },
          { label: '除非停止', value: RestartPolicy.UnlessStopped },
        ]}
        value={values}
        onChange={onChange}
      />
    </FormControl>
  );
}
