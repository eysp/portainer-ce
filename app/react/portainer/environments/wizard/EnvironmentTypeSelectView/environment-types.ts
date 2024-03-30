import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Docker from '@/assets/ico/vendor/docker.svg?c';
import Kubernetes from '@/assets/ico/vendor/kubernetes.svg?c';
import Azure from '@/assets/ico/vendor/azure.svg?c';
import Nomad from '@/assets/ico/vendor/nomad.svg?c';
import KaaS from '@/assets/ico/vendor/kaas-icon.svg?c';
import InstallK8s from '@/assets/ico/vendor/install-kubernetes.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector';

export type EnvironmentOptionValue =
  | 'dockerStandalone'
  | 'dockerSwarm'
  | 'kubernetes'
  | 'aci'
  | 'nomad'
  | 'kaas'
  | 'k8sInstall';

export interface EnvironmentOption
  extends BoxSelectorOption<EnvironmentOptionValue> {
  id: EnvironmentOptionValue;
  value: EnvironmentOptionValue;
}

export const existingEnvironmentTypes: EnvironmentOption[] = [
  {
    id: 'dockerStandalone',
    value: 'dockerStandalone',
    label: '独立的Docker',
    icon: Docker,
    iconType: 'logo',
    description: '通过URL/IP、API或Socket连接到独立的Docker',
  },
  {
    id: 'dockerSwarm',
    value: 'dockerSwarm',
    label: 'Docker Swarm',
    icon: Docker,
    iconType: 'logo',
    description: '通过URL/IP、API或Socket连接到Docker Swarm',
  },
  {
    id: 'kubernetes',
    value: 'kubernetes',
    label: 'Kubernetes',
    icon: Kubernetes,
    iconType: 'logo',
    description: '通过URL/IP连接到Kubernetes环境',
  },
  {
    id: 'aci',
    value: 'aci',
    label: 'ACI',
    description: '通过API连接到ACI环境',
    iconType: 'logo',
    icon: Azure,
  },
  {
    id: 'nomad',
    value: 'nomad',
    label: 'Nomad',
    description: '通过API连接到HashiCorp Nomad环境',
    icon: Nomad,
    iconType: 'logo',
    feature: FeatureId.NOMAD,
    disabledWhenLimited: true,
  },
];

export const newEnvironmentTypes: EnvironmentOption[] = [
  {
    id: 'kaas',
    value: 'kaas',
    label: '提供KaaS集群',
    description:
      "通过云提供商的Kubernetes即服务(KaaS)来提供一个Kubernetes集群",
    icon: KaaS,
    iconType: 'logo',
    feature: FeatureId.KAAS_PROVISIONING,
    disabledWhenLimited: true,
  },
  {
    id: 'k8sInstall',
    value: 'k8sInstall',
    label: '创建Kubernetes集群',
    description: '在现有基础设施上创建一个Kubernetes集群',
    icon: InstallK8s,
    iconType: 'logo',
    feature: FeatureId.K8SINSTALL,
    disabledWhenLimited: true,
  },
];

export const environmentTypes = [
  ...existingEnvironmentTypes,
  ...newEnvironmentTypes,
];

export const formTitles: Record<EnvironmentOptionValue, string> = {
  dockerStandalone: '连接到您的独立的Docker环境',
  dockerSwarm: '连接到您的Docker Swarm环境',
  kubernetes: '连接到您的Kubernetes环境',
  aci: '连接到您的ACI环境',
  nomad: '连接到您的Nomad环境',
  kaas: '提供一个KaaS环境',
  k8sInstall: '创建一个Kubernetes集群',
};
