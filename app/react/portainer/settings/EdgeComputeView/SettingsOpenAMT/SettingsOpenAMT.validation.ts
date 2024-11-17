import { object, string } from 'yup';

export function validationSchema() {
  return object().shape({
    mpsServer: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    mpsUser: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    mpsPassword: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    domainName: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    certFileContent: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    certFileName: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    certFilePassword: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
  });
}
