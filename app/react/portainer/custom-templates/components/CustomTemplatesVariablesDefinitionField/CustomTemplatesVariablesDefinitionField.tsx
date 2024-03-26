import { FormikErrors } from 'formik';

import { FormError } from '@@/form-components/FormError';
import { Input } from '@@/form-components/Input';
import { InputList } from '@@/form-components/InputList';
import { ItemProps } from '@@/form-components/InputList/InputList';

export interface VariableDefinition {
  name: string;
  label: string;
  defaultValue: string;
  description: string;
}

interface Props {
  value: VariableDefinition[];
  onChange: (value: VariableDefinition[]) => void;
  errors?: FormikErrors<VariableDefinition>[];
  isVariablesNamesFromParent?: boolean;
}

export function CustomTemplatesVariablesDefinitionField({
  onChange,
  value,
  errors,
  isVariablesNamesFromParent,
}: Props) {
  return (
    <InputList
      label="变量定义"
      onChange={onChange}
      value={value}
      renderItem={(item, onChange, index, error) => (
        <Item
          item={item}
          onChange={onChange}
          error={error}
          index={index}
          isNameReadonly={isVariablesNamesFromParent}
        />
      )}
      itemBuilder={() => ({
        label: '',
        name: '',
        defaultValue: '',
        description: '',
      })}
      errors={errors}
      textTip="列表应映射模板文件中的mustache变量，如果默认值为空，则变量将为必填项。"
      isAddButtonHidden={isVariablesNamesFromParent}
    />
  );
}

interface DefinitionItemProps extends ItemProps<VariableDefinition> {
  isNameReadonly?: boolean;
}

function Item({ item, onChange, error, isNameReadonly }: DefinitionItemProps) {
  const errorObj = typeof error === 'object' ? error : {};

  return (
    <div className="flex gap-2">
      <div>
        <Input
          value={item.name}
          name="name"
          onChange={handleChange}
          placeholder="名称（例如 var_name）"
          readOnly={isNameReadonly}
        />
        {errorObj?.name && <FormError>{errorObj.name}</FormError>}
      </div>
      <div>
        <Input
          value={item.label}
          onChange={handleChange}
          placeholder="标签"
          name="label"
        />
        {errorObj?.label && <FormError>{errorObj.label}</FormError>}
      </div>
      <div>
        <Input
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="描述"
        />
        {errorObj?.description && <FormError>{errorObj.description}</FormError>}
      </div>
      <div>
        <Input
          value={item.defaultValue}
          onChange={handleChange}
          placeholder="默认值"
          name="defaultValue"
        />
        {errorObj?.defaultValue && (
          <FormError>{errorObj.defaultValue}</FormError>
        )}
      </div>
    </div>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...item, [e.target.name]: e.target.value });
  }
}
