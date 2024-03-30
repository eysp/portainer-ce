import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import {
  updateSettings,
  getSettings,
  updateDefaultRegistry,
} from '../settings.service';
import { DefaultRegistry, Settings } from '../types';

import { queryKeys } from './queryKeys';

export function useSettings<T = Settings>(
  select?: (settings: Settings) => T,
  enabled = true
) {
  return useQuery(queryKeys.base(), getSettings, {
    select,
    enabled,
    staleTime: 50,
    ...withError('无法获取设置'),
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateSettings,
    mutationOptions(
      withInvalidate(queryClient, [queryKeys.base(), ['cloud']]),
      withError('无法更新设置')
    )
  );
}

export function useUpdateDefaultRegistrySettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: Partial<DefaultRegistry>) => updateDefaultRegistry(payload),
    mutationOptions(
      withInvalidate(queryClient, [queryKeys.base()]),
      withError('无法更新默认仓库设置')
    )
  );
}
