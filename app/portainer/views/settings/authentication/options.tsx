import { ArrowDownCircle } from 'react-feather';

import { FeatureId } from '@/portainer/feature-flags/enums';
import Microsoft from '@/assets/ico/vendor/microsoft.svg?c';
import Ldap from '@/assets/ico/ldap.svg?c';
import OAuth from '@/assets/ico/oauth.svg?c';

import { BadgeIcon } from '@@/BoxSelector/BadgeIcon';

export const options = [
  {
    id: 'auth_internal',
    icon: <BadgeIcon icon={ArrowDownCircle} />,
    label: 'Internal',
    description: '内部身份验证机制',
    value: 1,
  },
  {
    id: 'auth_ldap',
    icon: Ldap,
    label: 'LDAP',
    description: 'LDAP身份验证',
    value: 2,
  },
  {
    id: 'auth_ad',
    icon: Microsoft,
    label: 'Microsoft Active Directory',
    description: 'AD 身份验证',
    value: 4,
    feature: FeatureId.HIDE_INTERNAL_AUTH,
  },
  {
    id: 'auth_oauth',
    icon: OAuth,
    label: 'OAuth',
    description: 'OAuth身份验证',
    value: 3,
  },
];
