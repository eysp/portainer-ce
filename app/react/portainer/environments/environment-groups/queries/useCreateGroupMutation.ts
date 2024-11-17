import { useMutation, useQueryClient } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { TagId } from '@/portainer/tags/types';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import { EnvironmentId } from '../../types';
import { EnvironmentGroup } from '../types';

import { buildUrl } from './build-url';
import { queryKeys } from './query-keys';

interface CreateGroupPayload {
  name: string;
  description?: string;
  associatedEndpoints?: EnvironmentId[];
  tagIds?: TagId[];
}

export async function createGroup(requestPayload: CreateGroupPayload) {
  try {
    const { data: group } = await axios.post<EnvironmentGroup>(
      buildUrl(),
      requestPayload
    );
    return group;
  } catch (e) {
    throw parseAxiosError(e as Error, '创建分组失败');
  }
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    createGroup,
    mutationOptions(
      withError('创建分组失败'),
      withInvalidate(queryClient, [queryKeys.base()])
    )
  );
}
