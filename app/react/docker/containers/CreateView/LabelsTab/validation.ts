import { array, object, SchemaOf, string } from 'yup';

import { Values } from './types';

export function validation(): SchemaOf<Values> {
  return array(
    object({
      name: string().required('名称是必须的'),
      value: string().default(''),
    })
  );
}
