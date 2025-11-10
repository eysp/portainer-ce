import { BadgeIcon } from '@@/BadgeIcon';

import { RegistryTypes } from '../types/registry';
import { registryIconMap, registryLabelMap } from '../utils/constants';

export const options = [
  {
    id: 'registry_dockerhub',
    icon: registryIconMap[RegistryTypes.DOCKERHUB],
    label: registryLabelMap[RegistryTypes.DOCKERHUB],
    description: 'DockerHub 认证账户',
    value: String(RegistryTypes.DOCKERHUB),
  },
  {
    id: 'registry_aws_ecr',
    icon: registryIconMap[RegistryTypes.ECR],
    label: registryLabelMap[RegistryTypes.ECR],
    description: 'Amazon 弹性容器镜像仓库',
    value: String(RegistryTypes.ECR),
  },
  {
    id: 'registry_quay',
    icon: registryIconMap[RegistryTypes.QUAY],
    label: registryLabelMap[RegistryTypes.QUAY],
    description: 'Quay 容器镜像仓库',
    value: String(RegistryTypes.QUAY),
  },
  {
    id: 'registry_proget',
    icon: registryIconMap[RegistryTypes.PROGET],
    label: registryLabelMap[RegistryTypes.PROGET],
    description: 'ProGet 容器镜像仓库',
    value: String(RegistryTypes.PROGET),
  },
  {
    id: 'registry_azure',
    icon: registryIconMap[RegistryTypes.AZURE],
    label: registryLabelMap[RegistryTypes.AZURE],
    description: 'Azure 容器镜像仓库',
    value: String(RegistryTypes.AZURE),
  },
  {
    id: 'registry_gitlab',
    icon: registryIconMap[RegistryTypes.GITLAB],
    label: registryLabelMap[RegistryTypes.GITLAB],
    description: 'GitLab 容器镜像仓库',
    value: String(RegistryTypes.GITLAB),
  },
  {
    id: 'registry_custom',
    icon: <BadgeIcon icon={registryIconMap[RegistryTypes.CUSTOM]} />,
    label: registryLabelMap[RegistryTypes.CUSTOM],
    description: '定义您自己的镜像仓库',
    value: String(RegistryTypes.CUSTOM),
  },
];
