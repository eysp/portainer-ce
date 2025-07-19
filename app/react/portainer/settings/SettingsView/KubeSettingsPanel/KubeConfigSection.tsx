import { useField } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

const options = [
  {
    label: '1 天',
    value: '24h',
  },
  {
    label: '7 天',
    value: `${24 * 7}h`,
  },
  {
    label: '30 天',
    value: `${24 * 30}h`,
  },
  {
    label: '1 年',
    value: `${24 * 30 * 12}h`,
  },
  {
    label: '永不过期',
    value: '0',
  },
] as const;

export function KubeConfigSection() {
  const [{ value }, { error }, { setValue }] =
    useField<string>('kubeconfigExpiry');

  return (
    <FormSection title="Kubeconfig">
      <FormControl label="Kubeconfig 过期时间" errors={error}>
        <PortainerSelect
          value={value}
          options={options}
          onChange={(value) => value && setValue(value)}
          data-cy="kubeconfig-expiry-selector"
        />
      </FormControl>
    </FormSection>
  );
}
