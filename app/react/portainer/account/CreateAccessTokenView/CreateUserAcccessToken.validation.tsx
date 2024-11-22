import { SchemaOf, object, string } from 'yup';

import { ApiKeyFormValues } from './types';

export function getAPITokenValidationSchema(
  requirePassword: boolean
): SchemaOf<ApiKeyFormValues> {
  if (requirePassword) {
    return object({
      password: string().required('密码是必需的。'),
      description: string()
        .max(128, '描述必须最多 128 个字符')
        .required('描述是必需的。'),
    });
  }

  return object({
    password: string().optional(),
    description: string()
      .max(128, '描述必须最多 128 个字符')
      .required('描述是必需的。'),
  });
}
