import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

interface Props {
  fieldName: string;
  readonly?: boolean;
  required?: boolean;
}

export function PortainerTunnelAddrField({
  fieldName,
  readonly,
  required,
}: Props) {
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer 隧道服务器地址"
      tooltip="Edge 代理将使用此 Portainer 实例的地址建立反向隧道连接。"
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder="portainer.mydomain.tld"
        required={required}
        readOnly={readonly}
      />
    </FormControl>
  );
}

export function validation() {
  return string()
    .required('隧道服务器地址是必填项')
    .test(
      'valid tunnel server URL',
      '隧道服务器地址必须是有效地址（不能使用 localhost）',
      (value) => {
        if (!value) {
          return false;
        }

        return !value.startsWith('localhost');
      }
    );
}

/**
 * Returns an address that can be used as a default value for the Portainer tunnel server address
 * based on the current window location.
 * Used for Edge Compute.
 *
 */
export function buildDefaultValue() {
  return `${window.location.hostname}:8000`;
}
