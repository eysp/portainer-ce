import { SchemaOf, object, string } from 'yup';

import { ApiKeyFormValues } from './types';

export function getAPITokenValidationSchema(
  requirePassword: boolean
): SchemaOf<ApiKeyFormValues> {
  if (requirePassword) {
    return object({
      password: string().required('请输入密码。'),
      description: string()
        .max(128, '描述最多 128 个字符')
        .required('请输入描述。'),
    });
  }

  return object({
    password: string().optional(),
    description: string()
      .max(128, '描述最多 128 个字符')
      .required('请输入描述。'),
  });
}
