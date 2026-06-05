import { Config } from 'docker-types';
import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { withGlobalError } from '@/react-tools/react-query';

import { buildDockerProxyUrl } from '../../proxy/queries/buildDockerProxyUrl';

import { queryKeys } from './query-keys';

export function useConfigsList<T>(
  environmentId: EnvironmentId,
  {
    refetchInterval,
    select,
  }: { refetchInterval?: number; select?: (configs: Config[]) => T } = {}
) {
  return useQuery({
    queryKey: queryKeys.list(environmentId),
    queryFn: () => getConfigs(environmentId),
    refetchInterval,
    select,
    ...withGlobalError('Unable to retrieve configs'),
  });
}

export async function getConfigs(environmentId: EnvironmentId) {
  try {
    const { data } = await axios.get<Config[]>(
      buildDockerProxyUrl(environmentId, 'configs')
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to retrieve configs');
  }
}
