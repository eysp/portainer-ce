import { Field, useField } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

export function PublicUrlField() {
  const [, meta] = useField('publicUrl');

  return (
    <FormControl
      label="公网 IP / 域名"
      inputId="public-url-field"
      errors={meta.error}
      tooltip="暴露的容器对外可访问的 URL 或 IP 地址。此项为选填，默认使用环境 URL。"
    >
      <Field
        id="public-url-field"
        name="publicUrl"
        as={Input}
        placeholder="例如 10.0.0.10 或 mydocker.mydomain.com"
        data-cy="public-url-input"
      />
    </FormControl>
  );
}
