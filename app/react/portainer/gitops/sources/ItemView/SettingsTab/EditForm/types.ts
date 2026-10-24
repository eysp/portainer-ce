import { boolean as yupBoolean, object, string } from 'yup';

import { intervalValidation } from '../../../components/IntervalField';

export interface SettingsFormValues {
  name: string;
  url: string;
  tlsSkipVerify: boolean;
  authEnabled: boolean;
  username: string;
  password: string;
  pollingEnabled: boolean;
  interval: string;
}

export const validationSchema = object({
  name: string().required('名称是必填项'),
  url: string().required('存储库 URL 是必填项'),
  tlsSkipVerify: yupBoolean().defined(),
  authEnabled: yupBoolean().defined(),
  username: string().when('authEnabled', {
    is: true,
    then: (schema) => schema.required('用户名是必填项'),
    otherwise: (schema) => schema.optional(),
  }),
  password: string().optional(),
  pollingEnabled: yupBoolean().defined(),
  interval: string()
    .default('')
    .when('pollingEnabled', {
      is: true,
      then: () => intervalValidation(),
    }),
});
