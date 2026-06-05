import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { Stack, StackId } from '../types';

import { queryKeys } from './query-keys';
import { buildStackUrl } from './buildUrl';

export function useStack<T = Stack>(
  stackId?: StackId,
  queryOptions?: UseQueryOptions<Stack, unknown, T>
) {
  return useQuery({
    queryKey: queryKeys.stack(stackId),
    queryFn: () => getStack(stackId),
    enabled: !!stackId,
    ...withGlobalError('无法获取堆栈'),
    ...queryOptions,
  });
}

async function getStack(stackId?: StackId) {
  if (!stackId) {
    throw new Error('堆栈 ID 为必填项');
  }
  try {
    const { data } = await axios.get<Stack>(buildStackUrl(stackId));
    return data;
  } catch (e) {
    throw parseAxiosError(e, '无法获取堆栈');
  }
}
