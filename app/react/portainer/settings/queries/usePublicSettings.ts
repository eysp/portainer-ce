import { useQuery } from 'react-query';

import { withError } from '@/react-tools/react-query';

import { getPublicSettings } from '../settings.service';
import { PublicSettingsResponse } from '../types';

import { queryKeys } from './queryKeys';

export function usePublicSettings<T = PublicSettingsResponse>({
  enabled,
  select,
  onSuccess,
}: {
  select?: (settings: PublicSettingsResponse) => T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
} = {}) {
  return useQuery(queryKeys.public(), getPublicSettings, {
    select,
    ...withError('无法获取公共设置'),
    enabled,
    onSuccess,
  });
}
