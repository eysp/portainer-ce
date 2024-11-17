import { EnvironmentId } from '@/react/portainer/environments/types';
import axios, { parseAxiosError } from '@/portainer/services/axios';

import { ContainerId } from '../types';
import { buildDockerProxyUrl } from '../../proxy/queries/buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param id
 * @returns
 */
export async function containerTop(
  environmentId: EnvironmentId,
  id: ContainerId
) {
  try {
    const { data } = await axios.get(
      buildDockerProxyUrl(environmentId, 'containers', id, 'top')
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, '无法获取容器顶层信息');
  }
}
