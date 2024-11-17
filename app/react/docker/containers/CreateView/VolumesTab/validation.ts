import { object, SchemaOf, array, string, mixed } from 'yup';

import { Values, VolumeType, volumeTypes } from './types';

export function validation(): SchemaOf<Values> {
  return array(
    object({
      containerPath: string().required('必须填写容器路径'),
      type: mixed<VolumeType>()
        .oneOf([...volumeTypes])
        .default('volume'),
      name: string().required('必须填写存储卷名称'),
      readOnly: mixed<boolean>().default(false),
    })
  ).default([]);
}
