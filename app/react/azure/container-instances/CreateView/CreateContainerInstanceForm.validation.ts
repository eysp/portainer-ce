import { object, string, number, boolean } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('名称是必需的。'),
    image: string().required('镜像是必需的。'),
    subscription: string().required('订阅是必需的。'),
    resourceGroup: string().required('资源组是必需的。'),
    location: string().required('位置是必需的。'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
  });
}
