import { object, boolean, string } from 'yup';

export function validationSchema() {
  return object().shape({
    allowSelfSignedCertificates: boolean(),
    envVars: string(),
    edgeIdGenerator: string()
      .required('边缘 ID 生成器为必填项')
      .test(
        'valid edge id generator',
        'edge id generator cannot be empty',
        (value) => !!(value && value.length)
      ),
  });
}
