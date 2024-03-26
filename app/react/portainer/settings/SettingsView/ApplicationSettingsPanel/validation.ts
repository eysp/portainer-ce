import { SchemaOf, bool, boolean, number, object, string } from 'yup';

import { isValidUrl } from '@@/form-components/validate-url';

import { Values } from './types';

export function validation(): SchemaOf<Values> {
  return object({
    edgeAgentCheckinInterval: number().required(),
    enableTelemetry: bool().required(),
    loginBannerEnabled: boolean().default(false),
    loginBanner: string()
      .default('')
      .when('loginBannerEnabled', {
        is: true,
        then: (schema) =>
          schema.required('登录横幅在启用时是必需的'),
      }),
    logoEnabled: boolean().default(false),
    logo: string()
      .default('')
      .when('logoEnabled', {
        is: true,
        then: (schema) =>
          schema
            .required('徽标URL在启用时是必需的')
            .test('valid-url', '必须是有效的URL', (value) =>
              isValidUrl(value)
            ),
      }),
    snapshotInterval: string().required('快照间隔是必需的'),
    templatesUrl: string()
      .required('模板URL是必需的')
      .test('valid-url', '必须是有效的URL', (value) => isValidUrl(value)),
  });
}
