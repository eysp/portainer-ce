import { object, SchemaOf, string } from 'yup';

import { tlsConfigValidation } from '@/react/components/TLSFieldset/TLSFieldset';
import { useNameValidation } from '@/react/portainer/environments/common/NameField/NameField';
import { metadataValidation } from '@/react/portainer/environments/common/MetadataFieldset/validation';

import { FormValues } from './types';

export function useValidation(): SchemaOf<FormValues> {
  return object({
    name: useNameValidation(),
    url: string().required('此字段是必填项。'),
    tlsConfig: tlsConfigValidation(),
    meta: metadataValidation(),
  });
}
