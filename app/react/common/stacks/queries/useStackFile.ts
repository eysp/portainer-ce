import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { StackFile, StackId } from '../types';

import { queryKeys } from './query-keys';

export function useStackFile(
  stackId?: StackId,
  { version, commitHash }: { version?: number; commitHash?: string } = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.stackFile(stackId, { version, commitHash }),
    queryFn: ({ signal }) =>
      getStackFile({
        stackId: stackId!,
        version,
        commitHash,
        options: { signal },
      }),

    ...withGlobalError('无法获取堆栈'),
    enabled: !!stackId && enabled,
  });
}

export async function getStackFile({
  stackId,
  version,
  commitHash,
  options = {},
}: {
  stackId: StackId;
  version?: number;
  commitHash?: string;
  options?: { signal?: AbortSignal };
}) {
  try {
    const { data } = await axios.get<StackFile>(`/stacks/${stackId}/file`, {
      params: { version, commitHash },
      signal: options.signal,
    });
    return data;
  } catch (e) {
    throw parseAxiosError(e, '无法获取堆栈文件');
  }
}
