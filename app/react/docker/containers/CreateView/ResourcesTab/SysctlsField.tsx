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
      addLabel="添加系统调用"
      label="系统调用"
      errors={errors}
      itemBuilder={() => ({ name: '', value: '' })}
      data-cy="docker-container-sysctls"
    />
  );
}

function Item({ item, onChange, error, index }: ItemProps<Sysctls>) {
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
          data-cy={`docker-container-sysctl-name_${index}`}
        />
        <InputLabeled
          value={item.value}
          onChange={(e) => onChange({ ...item, value: e.target.value })}
          label="值"
          placeholder="例如 bar"
          className="w-1/2"
          size="small"
          data-cy={`docker-container-sysctl-value_${index}`}
        />
      </div>
      {error && <FormError>{Object.values(error)[0]}</FormError>}
    </div>
  );
}

export function sysctlsValidation(): SchemaOf<Values> {
  return array(
    object({
      name: string().required('名称为必填项'),
      value: string().required('值为必填项'),
    })
  );
}
