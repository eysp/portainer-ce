import { Edit } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Microsoft from '@/assets/ico/vendor/microsoft.svg?c';
import Google from '@/assets/ico/vendor/google.svg?c';
import Github from '@/assets/ico/vendor/github.svg?c';

export const options = [
  {
    id: 'microsoft',
    icon: Microsoft,
    label: 'Microsoft',
    description: 'Microsoft OAuth 提供商',
    value: 'microsoft',
    iconType: 'logo',
    feature: FeatureId.HIDE_INTERNAL_AUTH,
  },
  {
    id: 'google',
    icon: Google,
    label: 'Google',
    description: 'Google OAuth 提供商',
    value: 'google',
    iconType: 'logo',
    feature: FeatureId.HIDE_INTERNAL_AUTH,
  },
  {
    id: 'github',
    icon: Github,
    label: 'Github',
    description: 'Github OAuth 提供商',
    value: 'github',
    iconType: 'logo',
    feature: FeatureId.HIDE_INTERNAL_AUTH,
  },
  {
    id: 'custom',
    icon: Edit,
    iconType: 'badge',
    label: '自定义',
    description: '自定义 OAuth 提供商',
    value: 'custom',
  },
];
