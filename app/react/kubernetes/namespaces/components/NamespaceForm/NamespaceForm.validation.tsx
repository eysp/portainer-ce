import { string, object, array, SchemaOf } from 'yup';

import { NamespaceFormValues } from '../../types';

import { registriesValidationSchema } from './RegistriesFormSection/registriesValidationSchema';
import { getResourceQuotaValidationSchema } from './ResourceQuotaFormSection/getResourceQuotaValidationSchema';

export function getNamespaceValidationSchema(
  memoryLimit: number,
  cpuLimit: number,
  namespaceNames: string[]
): SchemaOf<NamespaceFormValues> {
  return object({
    name: string()
      .matches(
        /^[a-z0-9](?:[-a-z0-9]{0,251}[a-z0-9])?$/,
        "该字段必须由小写字母、数字或 '-' 组成，最多包含 63 个字符，且必须以字母或数字开头和结尾。"
      )
      .max(63, '名称最多为 63 个字符。')
      // must not have the same name as an existing namespace
      .notOneOf(namespaceNames, '名称必须唯一。')
      .required('名称是必填项。'),
    resourceQuota: getResourceQuotaValidationSchema(memoryLimit, cpuLimit),
    // ingress classes table is constrained already, and doesn't need validation
    ingressClasses: array(),
    registries: registriesValidationSchema,
  });
}
