import { useQuery } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withError } from '@/react-tools/react-query';
import { semverCompare } from '@/react/common/semver-utils';

import { queryKeys } from './query-keys';
import { buildUrl } from './urls';

export function useSupportedAgentVersions(
  minVersion?: string,
  { onSuccess }: { onSuccess?(data: string[]): void } = {}
) {
  return useQuery(
    [...queryKeys.supportedAgentVersions(), { minVersion }],
    getSupportedAgentVersions,
    {
      select(versions) {
        if (!minVersion) {
          return versions;
        }

        return versions.filter(
          (version) => semverCompare(version, minVersion) > 0
        );
      },
      onSuccess,
      ...withError('获取可用代理版本失败'),
    }
  );
}

async function getSupportedAgentVersions() {
  try {
    const { data } = await axios.get<string[]>(
      buildUrl(undefined, 'agent_versions')
    );
    return data;
  } catch (err) {
    throw parseAxiosError(
      err as Error,
      '获取边缘更新计划列表失败'
    );
  }
}
