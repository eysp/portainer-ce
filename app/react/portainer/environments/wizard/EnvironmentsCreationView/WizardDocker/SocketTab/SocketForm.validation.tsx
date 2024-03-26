import { boolean, object, SchemaOf, string } from 'yup';

import { metadataValidation } from '../../shared/MetadataFieldset/validation';
import { useNameValidation } from '../../shared/NameField';

import { FormValues } from './types';

export function useValidation(): SchemaOf<FormValues> {
  return object({
    name: useNameValidation(),
    meta: metadataValidation(),
    overridePath: boolean().default(false),
    socketPath: string()
      .default('')
      .when('overridePath', (overridePath, schema) =>
        overridePath
          ? schema.required(
              '当启用覆盖路径时，套接字路径是必填项'
            )
          : schema
      ),
  });
}
