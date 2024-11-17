import _ from 'lodash';

import { EnvironmentId } from '@/react/portainer/environments/types';
import PortainerError from '@/portainer/error';
import axios, { parseAxiosError } from '@/portainer/services/axios';

import { withAgentTargetHeader } from '../proxy/queries/utils';
import { buildDockerProxyUrl } from '../proxy/queries/buildDockerProxyUrl';
import { buildDockerUrl } from '../queries/utils/buildDockerUrl';

import { ContainerId, ContainerLogsParams } from './types';

export async function startContainer(
  environmentId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(environmentId, 'containers', id, 'start'),
      {},
      {
        headers: { ...withAgentTargetHeader(nodeName) },
      }
    );
  } catch (e) {
    throw parseAxiosError(e, 'Failed starting container');
  }
}

export async function stopContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'stop'),
      {},
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '停止容器失败');
  }
}

export async function recreateContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  pullImage: boolean,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerUrl(endpointId, 'containers', id, 'recreate'),
      {
        PullImage: pullImage,
      },
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '重建容器失败');
  }
}

export async function restartContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'restart'),
      {},
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '重启容器失败');
  }
}

export async function killContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'kill'),
      {},
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '杀死容器失败');
  }
}

export async function pauseContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'pause'),
      {},
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '暂停容器失败');
  }
}

export async function resumeContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'unpause'),
      {},
      { headers: { ...withAgentTargetHeader(nodeName) } }
    );
  } catch (e) {
    throw parseAxiosError(e, '恢复容器失败');
  }
}

export async function renameContainer(
  endpointId: EnvironmentId,
  id: ContainerId,
  name: string,
  { nodeName }: { nodeName?: string } = {}
) {
  try {
    await axios.post<void>(
      buildDockerProxyUrl(endpointId, 'containers', id, 'rename'),
      {},
      {
        params: { name },
        headers: { ...withAgentTargetHeader(nodeName) },
      }
    );
  } catch (e) {
    throw parseAxiosError(e, '重命名容器失败');
  }
}

export async function removeContainer(
  endpointId: EnvironmentId,
  containerId: string,
  {
    nodeName,
    removeVolumes,
  }: { removeVolumes?: boolean; nodeName?: string } = {}
) {
  try {
    const { data } = await axios.delete<null | { message: string }>(
      buildDockerProxyUrl(endpointId, 'containers', containerId),
      {
        params: { v: removeVolumes ? 1 : 0, force: true },
        headers: { ...withAgentTargetHeader(nodeName) },
      }
    );

    if (data && data.message) {
      throw new PortainerError(data.message);
    }
  } catch (e) {
    throw parseAxiosError(e, '无法删除容器');
  }
}

export async function getContainerLogs(
  environmentId: EnvironmentId,
  containerId: ContainerId,
  params?: ContainerLogsParams
): Promise<string> {
  try {
    const { data } = await axios.get<string>(
      buildDockerProxyUrl(environmentId, 'containers', containerId, 'logs'),
      {
        params: _.pickBy(params),
      }
    );

    return data;
  } catch (e) {
    throw parseAxiosError(e, '无法获取容器日志');
  }
}
