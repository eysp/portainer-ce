import { useMutation, useQueryClient } from 'react-query';

import {
  mutationOptions,
  withGlobalError,
  withInvalidate,
} from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';

import { CustomTemplate } from '../types';

import { queryKeys } from './query-keys';
import { buildUrl } from './build-url';

export function useDeleteTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    deleteTemplate,
    mutationOptions(
      withInvalidate(queryClient, [queryKeys.base()]),
      withGlobalError('无法删除自定义模板')
    )
  );
}
export async function deleteTemplate(id: CustomTemplate['Id']) {
  try {
    await axios.delete(buildUrl({ id }));
  } catch (e) {
    throw parseAxiosError(e, '无法获取自定义模板');
  }
}
