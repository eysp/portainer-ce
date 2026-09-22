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
    <FormControl label="重启策略 (Restart Policy)">
      <ButtonSelector
        options={[
          { label: '从不 (Never)', value: RestartPolicy.No },
          { label: '总是 (Always)', value: RestartPolicy.Always },
          { label: '容器非正常退出时 (On failure)', value: RestartPolicy.OnFailure },
          { label: '除非手动停止 (Unless stopped)', value: RestartPolicy.UnlessStopped },
        ]}
        value={values}
        onChange={onChange}
      />
    </FormControl>
  );
}
