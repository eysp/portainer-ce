import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Docker from '@/assets/ico/vendor/docker.svg?c';
import Podman from '@/assets/ico/vendor/podman.svg?c';
import Kubernetes from '@/assets/ico/vendor/kubernetes.svg?c';
import Kubesolo from '@/assets/ico/vendor/kubesolo.svg?c';
import Azure from '@/assets/ico/vendor/azure.svg?c';
import InstallK8s from '@/assets/ico/vendor/install-kubernetes.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector';

export type EnvironmentOptionValue =
  | 'dockerStandalone'
  | 'dockerSwarm'
  | 'podman'
  | 'kubernetes'
  | 'aci'
  | 'kubesolo'
  | 'k8sInstall';

export interface EnvironmentOption extends BoxSelectorOption<EnvironmentOptionValue> {
  id: EnvironmentOptionValue;
  value: EnvironmentOptionValue;
}
export const existingEnvironmentTypes: EnvironmentOption[] = [
  {
    id: 'dockerStandalone',
    value: 'dockerStandalone',
    label: 'Docker Standalone',
    icon: Docker,
    iconType: 'logo',
    description: '通过 URL/IP、API 或 Socket 连接到 Docker 独立主机',
  },
  {
    id: 'dockerSwarm',
    value: 'dockerSwarm',
    label: 'Docker Swarm',
    icon: Docker,
    iconType: 'logo',
    description: '通过 URL/IP、API 或 Socket 连接到 Docker Swarm',
  },
  {
    id: 'podman',
    value: 'podman',
    label: 'Podman',
    icon: Podman,
    iconType: 'logo',
    description: '通过 URL/IP 或 Socket 连接到 Podman',
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
    id: 'kubesolo',
    value: 'kubesolo',
    label: 'KubeSolo (Edge)',
    description:
      '使用 KubeSolo 部署单节点 Kubernetes 边缘环境',
    icon: Kubesolo,
    iconType: 'logo',
    feature: FeatureId.KUBESOLO,
    disabledWhenLimited: true,
  },
  {
    id: 'k8sInstall',
    value: 'k8sInstall',
    label: '创建 Kubernetes 集群',
    description: '在现有基础架构上创建 Kubernetes 集群',
    icon: InstallK8s,
    iconType: 'logo',
    feature: FeatureId.K8SINSTALL,
    disabledWhenLimited: true,
  },
];

export const environmentTypes: EnvironmentOption[] = [
  ...existingEnvironmentTypes,
  ...newEnvironmentTypes,
];

export const formTitles: Record<EnvironmentOptionValue, string> = {
  dockerStandalone: '连接到您的 Docker 独立主机环境',
  dockerSwarm: '连接到您的 Docker Swarm 环境',
  podman: '连接到您的 Podman 环境',
  kubernetes: '连接到您的 Kubernetes 环境',
  aci: '连接到您的 ACI 环境',
  kubesolo: '部署 KubeSolo 边缘环境',
  k8sInstall: '创建 Kubernetes 集群',
};
