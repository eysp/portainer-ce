import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

export function HostnameField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormControl label="主机名" errors={error}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如 web01"
        data-cy="docker-container-hostname-input"
      />
    </FormControl>
  );
}

export const hostnameSchema = string().default('');
