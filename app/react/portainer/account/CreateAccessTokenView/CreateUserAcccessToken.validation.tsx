import { SchemaOf, object, string } from 'yup';

import { ApiKeyFormValues } from './types';

export function getAPITokenValidationSchema(
  requirePassword: boolean
): SchemaOf<ApiKeyFormValues> {
  if (requirePassword) {
    return object({
      password: string().required('密码为必填项。'),
      description: string()
        .max(128, 'Description must be at most 128 characters')
        .required('描述为必填项。'),
    });
  }

  return object({
    password: string().optional(),
    description: string()
      .max(128, 'Description must be at most 128 characters')
      .required('描述为必填项。'),
  });
}
