import { array, object, string } from 'yup';

import { r2a } from '@/react-tools/react2angular';
import { withControlledInput } from '@/react-tools/withControlledInput';

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

function Item({ item, onChange }: ItemProps<Gpu>) {
  return (
    <div className="flex flex-grow gap-2">
      <InputGroup size="small" className="flex-grow">
        <InputGroup.Addon>GPU 名称</InputGroup.Addon>
        <InputGroup.Input
          placeholder="my-gpu"
          value={item.name}
          onChange={(e) => {
            onChange({ ...item, name: e.target.value });
          }}
        />
      </InputGroup>

      <InputGroup size="small" className="flex-grow">
        <InputGroup.Addon>索引或 UUID</InputGroup.Addon>
        <InputGroup.Input
          placeholder="0 或 GPU-6e2c7185-c3d3-ae22-da43-bc5267b89061"
          value={item.value}
          onChange={(e) => {
            onChange({ ...item, value: e.target.value });
          }}
        />
      </InputGroup>
    </div>
  );
}

export function GpusList({ value, onChange }: Props) {
  return (
    <InputList<Gpu>
      label="GPUs"
      tooltip="您可以选择设置可用于容器的 GPU，尽管“所有 GPU”始终可用。"
      value={value}
      onChange={onChange}
      itemBuilder={() => ({ value: '', name: '' })}
      addLabel="添加 GPU"
      item={Item}
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

export const GpusListAngular = r2a(withControlledInput(GpusList), [
  'value',
  'onChange',
]);
