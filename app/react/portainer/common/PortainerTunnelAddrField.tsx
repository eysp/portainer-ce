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
      label="Portainer隧道服务器地址"
      tooltip="Edge代理将使用此Portainer实例的地址建立反向隧道。"
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
    .required('隧道服务器地址是必填的')
    .test(
      '有效的隧道服务器 URL',
      '隧道服务器 URL必须是有效的地址（不能使用localhost）',
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
