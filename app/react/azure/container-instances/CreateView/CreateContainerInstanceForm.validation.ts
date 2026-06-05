import { object, string, number, boolean, array } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required('名称为必填项。'),
    image: string().required('镜像为必填项。'),
    subscription: string().required('Subscription is required.'),
    resourceGroup: string().required('Resource group is required.'),
    location: string().required('Location is required.'),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
    env: array()
      .of(
        object().shape({
          name: string().required('环境变量名称为必填项。'),
          value: string().required('环境变量值为必填项。'),
        })
      )
      .test(
        'unique',
        'This environment variable is already defined',
        buildUniquenessTest(
          () => 'This environment variable is already defined',
          'name'
        )
      ),
  });
}
