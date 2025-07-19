import { ArrowDownCircle } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Microsoft from '@/assets/ico/vendor/microsoft.svg?c';
import Ldap from '@/assets/ico/ldap.svg?c';
import OAuth from '@/assets/ico/oauth.svg?c';

export const options = [
  {
    id: 'auth_internal',
    icon: ArrowDownCircle,
    iconType: 'badge',
    label: '内部认证',
    description: '使用内置的认证机制',
    value: 1,
  },
  {
    id: 'auth_ldap',
    icon: Ldap,
    label: 'LDAP',
    description: 'LDAP 认证',
    iconType: 'logo',
    value: 2,
  },
  {
    id: 'auth_ad',
    icon: Microsoft,
    label: 'Microsoft 活动目录',
    description: 'Active Directory 认证',
    iconType: 'logo',
    value: 4,
    
  },
  {
    id: 'auth_oauth',
    icon: OAuth,
    label: 'OAuth',
    description: 'OAuth 认证',
    iconType: 'logo',
    value: 3,
  },
];
