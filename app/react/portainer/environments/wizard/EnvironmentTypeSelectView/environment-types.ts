import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Docker from '@/assets/ico/vendor/docker.svg?c';
import Kubernetes from '@/assets/ico/vendor/kubernetes.svg?c';
import Azure from '@/assets/ico/vendor/azure.svg?c';
import KaaS from '@/assets/ico/vendor/kaas-icon.svg?c';
import InstallK8s from '@/assets/ico/vendor/install-kubernetes.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector';

export type EnvironmentOptionValue =
  | 'dockerStandalone'
  | 'dockerSwarm'
  | 'kubernetes'
  | 'aci'
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
    label: 'Docker 单机模式',
    icon: Docker,
    iconType: 'logo',
    description: '通过 URL/IP、API 或 Socket 连接到 Docker 单机模式',
  },
  {
    id: 'dockerSwarm',
    value: 'dockerSwarm',
    label: 'Docker Swarm',
    icon: Docker,
    iconType: 'logo',
    description: '通过 URL/IP、API 或 Socket 连接到 Docker Swarm 集群',
  },
  {
    id: 'kubernetes',
    value: 'kubernetes',
    label: 'Kubernetes',
    icon: Kubernetes,
    iconType: 'logo',
    description: '通过 URL/IP 连接到 Kubernetes 环境',
  },
  {
    id: 'aci',
    value: 'aci',
    label: 'ACI',
    description: '通过 API 连接到 ACI 环境',
    iconType: 'logo',
    icon: Azure,
  },
];

export const newEnvironmentTypes: EnvironmentOption[] = [
  {
    id: 'kaas',
    value: 'kaas',
    label: '创建 KaaS 集群',
    description:
      "通过云服务商的 Kubernetes 即服务（KaaS）创建 Kubernetes 集群",
    icon: KaaS,
    iconType: 'logo',
    feature: FeatureId.KAAS_PROVISIONING,
    disabledWhenLimited: true,
  },
  {
    id: 'k8sInstall',
    value: 'k8sInstall',
    label: '创建 Kubernetes 集群',
    description: '在现有基础设施上创建 Kubernetes 集群',
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
  dockerStandalone: '连接到您的 Docker 单机模式环境',
  dockerSwarm: '连接到您的 Docker Swarm 集群环境',
  kubernetes: '连接到您的 Kubernetes 环境',
  aci: '连接到您的 ACI 环境',
  kaas: '创建 KaaS 环境',
  k8sInstall: '创建 Kubernetes 集群',
};
