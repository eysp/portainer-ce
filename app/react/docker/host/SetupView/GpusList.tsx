import { array, object, string } from 'yup';

import { InputList } from '@@/form-components/InputList';
import { ItemProps } from '@@/form-components/InputList/InputList';
import { InputGroup } from '@@/form-components/InputGroup';

export interface Gpu {
  value: string;
  name: string;
}

interface Props {
  value: Gpu[];
  onChange(value: Gpu[]): void;
}

function Item({ item, onChange, index }: ItemProps<Gpu>) {
  return (
    <div className="flex flex-grow gap-2">
      <InputGroup size="small" className="flex-grow">
        <InputGroup.Addon>GPU ����</InputGroup.Addon>
        <InputGroup.Input
          placeholder="my-gpu"
          value={item.name}
          onChange={(e) => {
            onChange({ ...item, name: e.target.value });
          }}
          data-cy={`docker-gpu-name_${index}`}
        />
      </InputGroup>

      <InputGroup size="small" className="flex-grow">
        <InputGroup.Addon>������ UUID</InputGroup.Addon>
        <InputGroup.Input
          placeholder="0 or GPU-6e2c7185-c3d3-ae22-da43-bc5267b89061"
          value={item.value}
          onChange={(e) => {
            onChange({ ...item, value: e.target.value });
          }}
          data-cy={`docker-gpu-value_${index}`}
        />
      </InputGroup>
    </div>
  );
}

export function GpusList({ value, onChange }: Props) {
  return (
    <InputList<Gpu>
      label="GPU"
      tooltip="������ѡ�����ÿɹ�����ѡ��� GPU����Ȼ'���� GPU (All GPUs)' ʼ�տ��á�"
      value={value}
      onChange={onChange}
      itemBuilder={() => ({ value: '', name: '' })}
      addLabel="���� GPU"
      item={Item}
      data-cy="docker-containers-gpus"
    />
  );
}

export function gpusListValidation() {
  const gpuShape = object().shape({
    name: string().required(),
    value: string().required(),
  });
  return array().of(gpuShape).default([]);
}
