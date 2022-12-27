import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

interface Props {
  fieldName: string;
  readonly?: boolean;
}

export function validation() {
  return string()
    .test(
      'url',
      'URL应该是一个有效的URI，不能包括localhost',
      (value) => {
        if (!value) {
          return false;
        }
        try {
          const url = new URL(value);
          return url.hostname !== 'localhost';
        } catch {
          return false;
        }
      }
    )
    .required('URL是必需的');
}

export function PortainerUrlField({ fieldName, readonly }: Props) {
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer server URL"
      tooltip="代理将用于启动通信的Portainer实例的URL。"
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder="例如 https://10.0.0.10:9443 或 https://portainer.mydomain.com"
        required
        data-cy="endpointCreate-portainerServerUrlInput"
        readOnly={readonly}
      />
    </FormControl>
  );
}
