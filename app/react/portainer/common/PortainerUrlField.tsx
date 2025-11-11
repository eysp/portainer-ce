import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { isValidUrl } from '@@/form-components/validate-url';

interface Props {
  fieldName: string;
  readonly?: boolean;
  required?: boolean;
  tooltip?: string;
}

export function PortainerUrlField({
  fieldName,
  readonly,
  required,
  tooltip = '代理将用于发起通信的 Portainer 实例 URL。',
}: Props) {
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer API 服务器 URL"
      tooltip={tooltip}
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder="https://portainer.mydomain.tld"
        required={required}
        data-cy="endpointCreate-portainerServerUrlInput"
        readOnly={readonly}
      />
    </FormControl>
  );
}

export function validation() {
  return string()
    .required('API 服务器 URL 为必填项')
    .test(
      'valid API server URL',
      'API 服务器 URL 必须是有效的 URL（不能使用 localhost）',
      (value) =>
        isValidUrl(
          value,
          (url) => !!url.hostname && url.hostname !== 'localhost'
        )
    );
}

/**
 * Returns a URL that can be used as a default value for the Portainer server API URL
 * based on the current window location.
 * Used for Edge Compute.
 *
 */
export function buildDefaultValue() {
  return `${window.location.protocol}//${window.location.host}`;
}
