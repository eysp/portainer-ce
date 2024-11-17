import { FormikErrors } from 'formik';
import { ArrowRight } from 'lucide-react';

import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { FormError } from '@@/form-components/FormError';
import { InputList } from '@@/form-components/InputList';
import { ItemProps } from '@@/form-components/InputList/InputList';
import { Icon } from '@@/Icon';
import { InputLabeled } from '@@/form-components/Input/InputLabeled';

export type Protocol = 'tcp' | 'udp';

export interface PortMapping {
  hostPort: string;
  protocol: Protocol;
  containerPort: string;
}

export type Values = Array<PortMapping>;

interface Props {
  value: Values;
  onChange?(value: Values): void;
  errors?: FormikErrors<PortMapping>[] | string | string[];
  disabled?: boolean;
  readOnly?: boolean;
}

export function PortsMappingField({
  value,
  onChange = () => {},
  errors,
  disabled,
  readOnly,
}: Props) {
  return (
    <>
      <InputList<PortMapping>
        label="端口映射"
        value={value}
        onChange={onChange}
        addLabel="映射附加端口"
        itemBuilder={() => ({
          hostPort: '',
          containerPort: '',
          protocol: 'tcp',
        })}
        item={Item}
        errors={errors}
        disabled={disabled}
        readOnly={readOnly}
        tooltip="当主机端口范围和容器端口指定为单个端口时，Docker会在定义的端口范围内随机选择一个可用端口，并将其转发到容器端口。"
      />
      {typeof errors === 'string' && (
        <div className="form-group col-md-12">
          <FormError>{errors}</FormError>
        </div>
      )}
    </>
  );
}

function Item({
  onChange,
  item,
  error,
  disabled,
  readOnly,
  index,
}: ItemProps<PortMapping>) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <InputLabeled
          size="small"
          disabled={disabled}
          readOnly={readOnly}
          value={item.hostPort}
          onChange={(e) => handleChange('hostPort', e.target.value)}
          label="主机"
          placeholder="例如 80"
          className="w-1/2"
          id={`hostPort-${index}`}
        />

        <span className="mx-3">
          <Icon icon={ArrowRight} />
        </span>

        <InputLabeled
          size="small"
          disabled={disabled}
          readOnly={readOnly}
          value={item.containerPort}
          onChange={(e) => handleChange('containerPort', e.target.value)}
          label="容器"
          placeholder="例如 80"
          className="w-1/2"
          id={`containerPort-${index}`}
        />

        <ButtonSelector<Protocol>
          onChange={(value) => handleChange('protocol', value)}
          value={item.protocol}
          options={[{ value: 'tcp' }, { value: 'udp' }]}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
      {!!error && <FormError>{Object.values(error)[0]}</FormError>}
    </div>
  );

  function handleChange(name: keyof PortMapping, value: string) {
    onChange({ ...item, [name]: value });
  }
}
