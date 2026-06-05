import { array, mixed, object, SchemaOf, string } from 'yup';

import { Values } from './PortsMappingField';

export function validationSchema(): SchemaOf<Values> {
  return array(
    object({
      hostPort: string().default(''),
      containerPort: string().required('容器端口为必填项'),
      protocol: mixed().oneOf(['tcp', 'udp']),
    })
  );
}
