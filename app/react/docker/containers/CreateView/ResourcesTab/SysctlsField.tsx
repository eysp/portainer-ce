import { FormikErrors } from 'formik';
import { array, object, SchemaOf, string } from 'yup';

import { FormError } from '@@/form-components/FormError';
import { InputList, ItemProps } from '@@/form-components/InputList';
import { InputLabeled } from '@@/form-components/Input/InputLabeled';

interface Sysctls {
  name: string;
  value: string;
}

export type Values = Array<Sysctls>;

export function SysctlsField({
  values,
  onChange,
  errors,
}: {
  values: Values;
  onChange: (value: Values) => void;
  errors?: FormikErrors<Sysctls>[];
}) {
  return (
    <InputList
      value={values}
      onChange={onChange}
      item={Item}
      addLabel="添加 sysctl"
      label="Sysctls"
      errors={errors}
      itemBuilder={() => ({ name: '', value: '' })}
    />
  );
}

function Item({ item, onChange, error }: ItemProps<Sysctls>) {
  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <InputLabeled
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          label="名称"
          placeholder="例如 FOO"
          className="w-1/2"
          size="small"
        />
        <InputLabeled
          value={item.value}
          onChange={(e) => onChange({ ...item, value: e.target.value })}
          label="值"
          placeholder="例如 bar"
          className="w-1/2"
          size="small"
        />
      </div>
      {error && <FormError>{Object.values(error)[0]}</FormError>}
    </div>
  );
}

export function sysctlsValidation(): SchemaOf<Values> {
  return array(
    object({
      name: string().required('名称是必需的'),
      value: string().required('值是必需的'),
    })
  );
}
