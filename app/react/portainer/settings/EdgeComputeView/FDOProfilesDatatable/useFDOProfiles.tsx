import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import PortainerError from '@/portainer/error';
import * as notifications from '@/portainer/services/notifications';
import { getProfiles } from '@/portainer/hostmanagement/fdo/fdo.service';

export function useFDOProfiles() {
  const { isLoading, data, isError, error } = useQuery('fdo_profiles', () =>
    getProfiles()
  );

  useEffect(() => {
    if (isError) {
      notifications.error(
        '失败',
        error as Error,
        '获取FDO配置文件失败'
      );
    }
  }, [isError, error]);

  const profiles = useMemo(() => data || [], [data]);

  return {
    isLoading,
    profiles,
    error: isError ? (error as PortainerError) : undefined,
  };
}
