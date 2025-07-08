import { FeatureId } from '@/react/portainer/feature-flags/enums';
import Docker from '@/assets/ico/vendor/docker.svg?c';
import Podman from '@/assets/ico/vendor/podman.svg?c';
import Kubernetes from '@/assets/ico/vendor/kubernetes.svg?c';
import Azure from '@/assets/ico/vendor/azure.svg?c';
import KaaS from '@/assets/ico/vendor/kaas-icon.svg?c';
import InstallK8s from '@/assets/ico/vendor/install-kubernetes.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector';

export type EnvironmentOptionValue =
  | 'dockerStandalone'
  | 'dockerSwarm'
  | 'podman'
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
    label: 'Docker Standalone',
    icon: Docker,
    iconType: 'logo',
    description: 'Connect to Docker Standalone via URL/IP, API or Socket',
  },
  {
    id: 'dockerSwarm',
    value: 'dockerSwarm',
    label: 'Docker Swarm',
    icon: Docker,
    iconType: 'logo',
    description: 'Connect to Docker Swarm via URL/IP, API or Socket',
  },
  {
    id: 'podman',
    value: 'podman',
    label: 'Podman',
    icon: Podman,
    iconType: 'logo',
    description: 'Connect to Podman via URL/IP or Socket',
  },
  {
    id: 'kubernetes',
    value: 'kubernetes',
    label: 'Kubernetes',
    icon: Kubernetes,
    iconType: 'logo',
    description: 'Connect to a Kubernetes environment via URL/IP',
  },
  {
    id: 'aci',
    value: 'aci',
    label: 'ACI',
    description: 'Connect to ACI environment via API',
    iconType: 'logo',
    icon: Azure,
  },
];

export const newEnvironmentTypes: EnvironmentOption[] = [
  {
    id: 'kaas',
    value: 'kaas',
    label: 'Provision KaaS Cluster',
    description:
      "Provision a Kubernetes cluster via a cloud provider's Kubernetes as a Service",
    icon: KaaS,
    iconType: 'logo',
    feature: FeatureId.KAAS_PROVISIONING,
    disabledWhenLimited: true,
  },
  {
    id: 'k8sInstall',
    value: 'k8sInstall',
    label: 'Create Kubernetes cluster',
    description: 'Create a Kubernetes cluster on existing infrastructure',
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
  dockerStandalone: '连接到您的 Docker 独立环境',
  dockerSwarm: '连接到您的 Docker Swarm 环境',
  podman: '连接到您的 Podman 环境',
  kubernetes: '连接到您的 Kubernetes 环境',
  aci: '连接到您的 ACI 环境',
  kaas: '配置一个 KaaS 环境',
  k8sInstall: '创建一个 Kubernetes 集群',
};
