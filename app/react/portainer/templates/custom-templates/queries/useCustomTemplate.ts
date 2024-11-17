import { useQuery } from 'react-query';

import { withGlobalError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';

import { CustomTemplate } from '../types';

import { queryKeys } from './query-keys';
import { buildUrl } from './build-url';

export async function getCustomTemplate(id: CustomTemplate['Id']) {
  try {
    const { data } = await axios.get<CustomTemplate>(buildUrl({ id }));
    return data;
  } catch (e) {
    throw parseAxiosError(e, '无法获取自定义模板');
  }
}

export function useCustomTemplate(id?: CustomTemplate['Id']) {
  return useQuery(queryKeys.item(id!), () => getCustomTemplate(id!), {
    ...withGlobalError('无法检索自定义模板'),
    enabled: !!id,
  });
}
