import { object, string, number, boolean } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('名称不能为空。'),
    image: string().required('镜像不能为空。'),
    subscription: string().required('订阅不能为空。'),
    resourceGroup: string().required('资源组不能为空。'),
    location: string().required('位置不能为空。'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
  });
}
