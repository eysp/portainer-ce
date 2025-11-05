import { boolean, object, SchemaOf, string } from 'yup';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { imageConfigValidation } from '@@/ImageConfigFieldset';

import { Values } from './BaseForm';
import { validationSchema as portsSchema } from './PortsMappingField.validation';
import { nameValidation } from './NameField';

export function validation(
  {
    isAdmin,
    isDuplicating,
    isDuplicatingPortainer,
    isDockerhubRateLimited,
  }: {
    isAdmin: boolean;
    isDuplicating: boolean | undefined;
    isDuplicatingPortainer: boolean | undefined;
    isDockerhubRateLimited: boolean;
  } = {
    isAdmin: false,
    isDuplicating: false,
    isDuplicatingPortainer: false,
    isDockerhubRateLimited: false,
  }
): SchemaOf<Values> {
  return object({
    name: nameValidation().test(
      'not-duplicate-portainer',
      () => !isDuplicatingPortainer
    ),
    alwaysPull: boolean()
      .default(true)
      .test('rate-limits', '超出速率限制', (alwaysPull: boolean) =>
        alwaysPull ? !isDockerhubRateLimited : true
      ),
    accessControl: accessControlSchema(isAdmin),
    autoRemove: boolean().default(false),
    enableWebhook: boolean().default(false),
    nodeName: string().default(''),
    ports: portsSchema(),
    publishAllPorts: boolean().default(false),
    image: imageConfigValidation().test(
      'duplicate-must-have-registry',
      '只有在选择了镜像仓库时才能复制',
      (value) => !isDuplicating || typeof value.registryId !== 'undefined'
    ),
  });
}
