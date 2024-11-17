import { SchemaOf, bool, boolean, number, object, string } from 'yup';

import { isValidUrl } from '@@/form-components/validate-url';

import { Values } from './types';

export function validation(): SchemaOf<Values> {
  return object({
    edgeAgentCheckinInterval: number().required(),
    enableTelemetry: bool().default(false),
    loginBannerEnabled: boolean().default(false),
    loginBanner: string()
      .default('')
      .when('loginBannerEnabled', {
        is: true,
        then: (schema) =>
          schema.required('启用时必须填写登录横幅'),
      }),
    logoEnabled: boolean().default(false),
    logo: string()
      .default('')
      .when('logoEnabled', {
        is: true,
        then: (schema) =>
          schema
            .required('启用时必须提供 Logo URL')
            .test('valid-url', '必须是有效的 URL', (value) =>
              isValidUrl(value)
            ),
      }),
    snapshotInterval: string().required('快照间隔是必填项'),
    templatesUrl: string()
      .default('')
      .test(
        'valid-url',
        '必须是有效的 URL',
        (value) => !value || isValidUrl(value)
      ),
  });
}
