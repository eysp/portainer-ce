import { object, string, number, boolean } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('名称是必填项。'),
    image: string().required('镜像是必填项。'),
    subscription: string().required('需要订阅。'),
    resourceGroup: string().required('需要资源组。'),
    location: string().required('位置是必填项。'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
  });
}
