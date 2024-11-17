import { ResourceControlViewModel } from '@/react/portainer/access-control/models/ResourceControlViewModel';

import { DockerContainerResponse } from './types/response';

export enum ContainerStatus {
  Paused = '暂停',
  Stopped = '停止',
  Created = '已创建',
  Healthy = '状态良好',
  Unhealthy = '状态异常',
  Starting = '启动中',
  Running = '运行中',
  Dead = '已死亡',
  Exited = '已退出',
}

export type QuickAction = '附加' | '执行' | '检查' | '日志' | '统计';

export interface Port {
  host?: string;
  public: number;
  private: number;
}

export type ContainerId = string;

/**
 * Computed fields from Container List Raw data
 */
type DecoratedDockerContainer = {
  NodeName: string;
  ResourceControl?: ResourceControlViewModel;
  IP: string;
  StackName?: string;
  Status: ContainerStatus;
  Ports: Port[];
  StatusText: string;
  Gpus: string;
};

/**
 * Docker Container list ViewModel
 *
 * Alias AngularJS ContainerViewModel
 *
 * Raw details is ContainerDetailsJSON
 */
export type ContainerListViewModel = DecoratedDockerContainer &
  Omit<DockerContainerResponse, keyof DecoratedDockerContainer>;

export type ContainerLogsParams = {
  stdout?: boolean;
  stderr?: boolean;
  timestamps?: boolean;
  since?: number;
  tail?: number;
};
