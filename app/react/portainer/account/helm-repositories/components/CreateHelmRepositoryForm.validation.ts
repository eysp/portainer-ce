import { object, string } from 'yup';

import { isValidUrl } from '@@/form-components/validate-url';

export function noDuplicateURLsSchema(urls: string[]) {
  return string()
    .required('请输入 URL')
    .test('not existing name', '该 URL 已经添加', (newName) =>
      urls.every((name) => name !== newName)
    );
}

export function validationSchema(urls: string[]) {
  return object().shape({
    URL: noDuplicateURLsSchema(urls)
      .test('valid-url', 'URL 格式无效', (value) => !value || isValidUrl(value))
      .required('请输入 URL'),
  });
}
