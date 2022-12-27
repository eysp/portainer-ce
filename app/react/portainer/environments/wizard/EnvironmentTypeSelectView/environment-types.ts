import { FeatureId } from '@/portainer/feature-flags/enums';

import KaaSIcon from './kaas-icon.svg?c';

export const environmentTypes = [
  {
    id: 'dockerStandalone',
    title: 'Docker Standalone',
    icon: 'fab fa-docker',
    description: '通过URL/IP、API或Socket连接到Docker Standalone',
    featureId: undefined,
  },
  {
    id: 'dockerSwarm',
    title: 'Docker Swarm',
    icon: 'fab fa-docker',
    description: '通过URL/IP、API或Socket连接到Docker Swarm',
    featureId: undefined,
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    icon: 'fas fa-dharmachakra',
    description: '通过URL/IP连接到kubernetes环境',
    featureId: undefined,
  },
  {
    id: 'aci',
    title: 'ACI',
    description: '通过API连接到ACI环境',
    icon: 'fab fa-microsoft',
    featureId: undefined,
  },
  {
    id: 'nomad',
    title: 'Nomad',
    description: '通过API连接到HashiCorp Nomad环境',
    icon: 'nomad-icon',
    featureId: FeatureId.NOMAD,
  },
  {
    id: 'kaas',
    title: 'KaaS',
    description: '向云提供商提供一个Kubernetes环境',
    icon: KaaSIcon,
    featureId: FeatureId.KAAS_PROVISIONING,
  },
] as const;
