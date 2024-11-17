import { object, string } from 'yup';

import { isValidUrl } from '@@/form-components/validate-url';

export function noDuplicateURLsSchema(urls: string[]) {
  return string()
    .required('URL是必填项')
    .test('not existing name', 'URL已经被添加', (newName) =>
      urls.every((name) => name !== newName)
    );
}

export function validationSchema(urls: string[]) {
  return object().shape({
    URL: noDuplicateURLsSchema(urls)
      .test('valid-url', '无效的 URL', (value) => !value || isValidUrl(value))
      .required('URL是必填项'),
  });
}
