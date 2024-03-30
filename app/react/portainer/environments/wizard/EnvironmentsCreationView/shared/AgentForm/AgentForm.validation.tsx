import { object, SchemaOf, string } from 'yup';

import { CreateAgentEnvironmentValues } from '@/react/portainer/environments/environment.service/create';

import { metadataValidation } from '../MetadataFieldset/validation';
import { useNameValidation } from '../NameField';

export function useValidation(): SchemaOf<CreateAgentEnvironmentValues> {
  return object({
    name: useNameValidation(),
    environmentUrl: environmentValidation(),
    meta: metadataValidation(),
  });
}

function environmentValidation() {
  return string()
    .required('此字段为必填项')
    .test(
      'address',
      '环境地址必须符合 <IP>:<PORT> 或 <HOST>:<PORT> 的格式。',
      (environmentUrl) => validateAddress(environmentUrl)
    );
}

export function validateAddress(address: string | undefined) {
  if (typeof address === 'undefined') {
    return false;
  }

  if (address.indexOf('://') > -1) {
    return false;
  }

  const [host, port] = address.split(':');

  if (
    host.length === 0 ||
    Number.isNaN(parseInt(port, 10)) ||
    port.match(/^[0-9]+$/) == null ||
    parseInt(port, 10) < 1 ||
    parseInt(port, 10) > 65535
  ) {
    return false;
  }

  return true;
}
