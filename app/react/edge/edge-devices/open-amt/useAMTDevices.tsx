import { useQuery } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';

import { Device } from './types';

export function useAMTDevices(
  environmentId: EnvironmentId,
  { enabled }: { enabled?: boolean } = {}
) {
  return useQuery(
    ['amt_devices', environmentId],
    () => getDevices(environmentId),
    {
      ...withError('检索 AMT 设备失败'),
      enabled,
    }
  );
}

async function getDevices(environmentId: EnvironmentId) {
  try {
    const { data: devices } = await axios.get<Device[]>(
      `/open_amt/${environmentId}/devices`
    );

    return devices;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法检索设备信息');
  }
}
