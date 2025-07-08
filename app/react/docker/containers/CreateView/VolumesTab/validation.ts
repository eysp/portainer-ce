import { object, SchemaOf, array, string, mixed } from 'yup';

import { Values, VolumeType, volumeTypes } from './types';

export function validation(): SchemaOf<Values> {
  return array(
    object({
      containerPath: string().required('容器路径是必填项'),
      type: mixed<VolumeType>()
        .oneOf([...volumeTypes])
        .default('volume'),
      name: string().required('卷名称是必填项'),
      readOnly: mixed<boolean>().default(false),
    })
  ).default([]);
}
