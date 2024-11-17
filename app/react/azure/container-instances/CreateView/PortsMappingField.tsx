import { FormikErrors } from 'formik';
import { ArrowRight } from 'lucide-react';

import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { FormError } from '@@/form-components/FormError';
import { InputGroup } from '@@/form-components/InputGroup';
import { InputList } from '@@/form-components/InputList';
import { ItemProps } from '@@/form-components/InputList/InputList';
import { Icon } from '@@/Icon';

import styles from './PortsMappingField.module.css';

type Protocol = 'TCP' | 'UDP';

export interface PortMapping {
  host?: number;
  container?: number;
  protocol: Protocol;
}

interface Props {
  value: PortMapping[];
  onChange?(value: PortMapping[]): void;
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
        addLabel="映射额外端口"
        itemBuilder={() => ({
          host: 0,
          container: 0,
          protocol: 'TCP',
        })}
        item={Item}
        errors={errors}
        disabled={disabled}
        readOnly={readOnly}
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
}: ItemProps<PortMapping>) {
  return (
    <div className={styles.item}>
      <div className="flex items-center gap-2">
        <InputGroup size="small">
          <InputGroup.Addon>主机</InputGroup.Addon>
          <InputGroup.Input
            placeholder="例如 80"
            value={item.host}
            onChange={(e) =>
              handleChange('host', parseInt(e.target.value || '0', 10))
            }
            disabled={disabled}
            readOnly={readOnly}
            type="number"
          />
        </InputGroup>

        <span className="mx-3">
          <Icon icon={ArrowRight} />
        </span>

        <InputGroup size="small">
          <InputGroup.Addon>容器</InputGroup.Addon>
          <InputGroup.Input
            placeholder="例如 80"
            value={item.container}
            onChange={(e) =>
              handleChange('container', parseInt(e.target.value || '0', 10))
            }
            disabled={disabled}
            readOnly={readOnly}
            type="number"
          />
        </InputGroup>

        <ButtonSelector<Protocol>
          onChange={(value) => handleChange('protocol', value)}
          value={item.protocol}
          options={[{ value: 'TCP' }, { value: 'UDP' }]}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
      {!!error && (
        <div className={styles.errors}>
          <FormError>{Object.values(error)[0]}</FormError>
        </div>
      )}
    </div>
  );

  function handleChange(name: keyof PortMapping, value: string | number) {
    onChange({ ...item, [name]: value });
  }
}
