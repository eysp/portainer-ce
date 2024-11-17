import { array, mixed, object, SchemaOf, string } from 'yup';

import { Values } from './PortsMappingField';

export function validationSchema(): SchemaOf<Values> {
  return array(
    object({
      hostPort: string().required('主机端口是必需的'),
      containerPort: string().required('容器端口是必需的'),
      protocol: mixed().oneOf(['tcp', 'udp']),
    })
  );
}
