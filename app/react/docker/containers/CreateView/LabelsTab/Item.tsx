import { FormError } from '@@/form-components/FormError';
import { InputGroup } from '@@/form-components/InputGroup';
import { ItemProps } from '@@/form-components/InputList';

import { Label } from './types';

export function Item({ item, onChange, error }: ItemProps<Label>) {
  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <InputGroup className="w-1/2">
          <InputGroup.Addon>名称</InputGroup.Addon>
          <InputGroup.Input
            value={item.name}
            onChange={(e) => onChange({ ...item, name: e.target.value })}
            placeholder="例如 com.example.foo"
          />
        </InputGroup>
        <InputGroup className="w-1/2">
          <InputGroup.Addon>值</InputGroup.Addon>
          <InputGroup.Input
            value={item.value}
            onChange={(e) => onChange({ ...item, value: e.target.value })}
            placeholder="例如 bar"
          />
        </InputGroup>
      </div>
      {error && <FormError>{Object.values(error)[0]}</FormError>}
    </div>
  );
}
