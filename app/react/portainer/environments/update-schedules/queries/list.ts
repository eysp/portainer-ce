import { useQuery } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';

import { EdgeUpdateResponse, StatusType } from '../types';

import { queryKeys } from './query-keys';
import { buildUrl } from './urls';

export type EdgeUpdateListItemResponse = EdgeUpdateResponse & {
  status: StatusType;
  statusMessage: string;
};

async function getList(includeEdgeStacks?: boolean) {
  try {
    const { data } = await axios.get<EdgeUpdateListItemResponse[]>(buildUrl(), {
      params: { includeEdgeStacks },
    });
    return data;
  } catch (err) {
    throw parseAxiosError(
      err as Error,
      '获取边缘更新计划列表失败'
    );
  }
}

export function useList(includeEdgeStacks?: boolean) {
  return useQuery(queryKeys.list(includeEdgeStacks), () =>
    getList(includeEdgeStacks)
  );
}
