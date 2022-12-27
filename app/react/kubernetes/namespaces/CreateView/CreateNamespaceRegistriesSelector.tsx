import { Registry } from '@/portainer/environments/environment.service/registries';

import { Select } from '@@/form-components/ReactSelect';

interface Props {
  value: Registry[];
  onChange(value: readonly Registry[]): void;
  options: Registry[];
  inputId?: string;
}

export function CreateNamespaceRegistriesSelector({
  value,
  onChange,
  options,
  inputId,
}: Props) {
  return (
    <Select
      isMulti
      getOptionLabel={(option) => option.Name}
      getOptionValue={(option) => String(option.Id)}
      options={options}
      value={value}
      closeMenuOnSelect={false}
      onChange={onChange}
      inputId={inputId}
      data-cy="namespaceCreate-registrySelect"
      placeholder="选择一个或多个注册表"
    />
  );
}
