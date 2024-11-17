import { useQuery } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withError } from '@/react-tools/react-query';

import { buildUrl } from '../user.service';
import { User, UserId } from '../types';

import { userQueryKeys } from './queryKeys';

export function useUser(
  id: UserId,
  { staleTime }: { staleTime?: number } = {}
) {
  return useQuery(userQueryKeys.user(id), () => getUser(id), {
    ...withError('无法获取用户详情'),
    staleTime,
  });
}

export async function getUser(id: UserId) {
  try {
    const { data: user } = await axios.get<User>(buildUrl(id));

    return user;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取用户详情');
  }
}
