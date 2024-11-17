import { useMutation, useQueryClient } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { BackupS3Model } from '../types';

import { buildUrl } from './backupSettings.service';
import { queryKeys } from './queryKeys';

export function useUpdateBackupS3SettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateBackupS3Settings, {
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.backupS3Settings()),
    ...withGlobalError('无法保存 S3 备份设置'),
  });
}

async function updateBackupS3Settings(payload: BackupS3Model) {
  try {
    const response = await axios.post(buildUrl('s3', 'settings'), payload);

    return response.data;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法保存 S3 备份设置');
  }
}
