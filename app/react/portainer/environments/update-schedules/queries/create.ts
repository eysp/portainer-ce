import { useMutation, useQueryClient } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withError, withInvalidate } from '@/react-tools/react-query';

import { EdgeUpdateSchedule } from '../types';
import { FormValues } from '../common/types';

import { queryKeys } from './query-keys';
import { buildUrl } from './urls';

async function create(schedule: FormValues) {
  try {
    const { data } = await axios.post<EdgeUpdateSchedule>(buildUrl(), schedule);

    return data;
  } catch (err) {
    throw parseAxiosError(
      err as Error,
      '创建边缘更新计划失败'
    );
  }
}

export function useCreateMutation() {
  const queryClient = useQueryClient();
  return useMutation(create, {
    ...withInvalidate(queryClient, [queryKeys.base()]),
    ...withError(),
  });
}
