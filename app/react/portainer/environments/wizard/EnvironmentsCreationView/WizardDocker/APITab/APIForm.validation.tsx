import { boolean, object, SchemaOf, string } from 'yup';

import { gpusListValidation } from '@/react/portainer/environments/wizard/EnvironmentsCreationView/shared/Hardware/GpusList';

import { metadataValidation } from '../../shared/MetadataFieldset/validation';
import { nameValidation } from '../../shared/NameField';

import { validation as certsValidation } from './TLSFieldset';
import { FormValues } from './types';

export function validation(): SchemaOf<FormValues> {
  return object({
    name: nameValidation(),
    url: string().required('此字段必填。'),
    tls: boolean().default(false),
    skipVerify: boolean(),
    meta: metadataValidation(),
    ...certsValidation(),
    gpus: gpusListValidation(),
  });
}
