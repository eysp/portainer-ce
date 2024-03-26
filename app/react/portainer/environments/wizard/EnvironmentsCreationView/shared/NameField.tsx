import { useField } from 'formik';
import { string } from 'yup';

import { getEnvironments } from '@/react/portainer/environments/environment.service';
import { useDebounce } from '@/react/hooks/useDebounce';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { useCachedValidation } from '@@/form-components/useCachedTest';

interface Props {
  readonly?: boolean;
  tooltip?: string;
  placeholder?: string;
}

export function NameField({
  readonly,
  tooltip,
  placeholder = '例如 docker-prod01 / kubernetes-cluster01',
}: Props) {
  const [{ value }, meta, { setValue }] = useField('name');

  const id = 'name-input';

  const [debouncedValue, setDebouncedValue] = useDebounce(value, setValue);

  return (
    <FormControl
      label="Name"
      required
      errors={meta.error}
      inputId={id}
      tooltip={tooltip}
    >
      <Input
        id={id}
        name="name"
        onChange={(e) => setDebouncedValue(e.target.value)}
        value={debouncedValue}
        data-cy="endpointCreate-nameInput"
        placeholder={placeholder}
        readOnly={readonly}
      />
    </FormControl>
  );
}

export async function isNameUnique(name = '') {
  if (!name) {
    return true;
  }

  try {
    const result = await getEnvironments({
      limit: 1,
      query: { name, excludeSnapshots: true },
    });
    return (
      result.totalCount === 0 || result.value.every((e) => e.Name !== name)
    );
  } catch (e) {
    // if backend fails to respond, assume name is unique, name validation happens also in the backend
    return true;
  }
}

export function useNameValidation() {
  const uniquenessTest = useCachedValidation(isNameUnique);

  return string()
    .required('名称是必填项')
    .test('unique-name', '名称应该唯一', uniquenessTest);
}
