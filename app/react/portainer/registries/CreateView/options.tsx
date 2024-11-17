import { Edit } from 'lucide-react';

import Docker from '@/assets/ico/vendor/docker.svg?c';
import Ecr from '@/assets/ico/vendor/ecr.svg?c';
import Quay from '@/assets/ico/vendor/quay.svg?c';
import Proget from '@/assets/ico/vendor/proget.svg?c';
import Azure from '@/assets/ico/vendor/azure.svg?c';
import Gitlab from '@/assets/ico/vendor/gitlab.svg?c';

import { BadgeIcon } from '@@/BadgeIcon';

export const options = [
  {
    id: 'registry_dockerhub',
    icon: Docker,
    label: 'DockerHub',
    description: 'DockerHub 认证账户',
    value: '6',
  },
  {
    id: 'registry_aws_ecr',
    icon: Ecr,
    label: 'AWS ECR',
    description: '亚马逊弹性容器注册表',
    value: '7',
  },
  {
    id: 'registry_quay',
    icon: Quay,
    label: 'Quay.io',
    description: 'Quay 容器注册表',
    value: '1',
  },
  {
    id: 'registry_proget',
    icon: Proget,
    label: 'ProGet',
    description: 'ProGet 容器注册表',
    value: '5',
  },
  {
    id: 'registry_azure',
    icon: Azure,
    label: 'Azure',
    description: 'Azure 容器注册表',
    value: '2',
  },
  {
    id: 'registry_gitlab',
    icon: Gitlab,
    label: 'GitLab',
    description: 'GitLab 容器注册表',
    value: '4',
  },
  {
    id: 'registry_custom',
    icon: <BadgeIcon icon={Edit} />,
    label: '自定义注册表',
    description: '定义您自己的注册表',
    value: '3',
  },
];
