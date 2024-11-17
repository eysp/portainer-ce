import { object, string } from 'yup';

export function validationSchema() {
  return object().shape({
    ownerURL: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    ownerUsername: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
    ownerPassword: string().when('enabled', {
      is: true,
      then: string().required('此字段是必填项'),
    }),
  });
}
