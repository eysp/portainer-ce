import { object, string, number, boolean } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('镜像名称为必填项。'),
    image: string().required('镜像为必填项。'),
    subscription: string().required('订阅为必填项。'),
    resourceGroup: string().required('资源组为必填项。'),
    location: string().required('位置为必填项。'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
  });
}
