import { ResourceControlViewModel } from '@/react/portainer/access-control/models/ResourceControlViewModel';

import { DockerContainerResponse } from './types/response';

export enum ContainerStatus {
  Paused = '暂停',
  Stopped = '停止',
  Created = '创建',
  Healthy = 'healthy',
  Unhealthy = 'unhealthy',
  Starting = '启动中',
  Running = 'running',
  Dead = 'dead',
  Exited = 'exited',
}

export type QuickAction = '附加' | '执行' | '检查' | '日志' | '状态';

export interface Port {
  host?: string;
  public: number;
  private: number;
}

export type ContainerId = string;

type DecoratedDockerContainer = {
  NodeName: string;
  ResourceControl?: ResourceControlViewModel;
  IP: string;
  StackName?: string;
  Status: ContainerStatus;
  Ports: Port[];
  StatusText: string;
  Image: string;
  Gpus: string;
};

export type DockerContainer = DecoratedDockerContainer &
  Omit<DockerContainerResponse, keyof DecoratedDockerContainer>;
