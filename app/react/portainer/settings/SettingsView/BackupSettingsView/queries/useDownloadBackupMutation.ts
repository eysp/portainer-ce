import { useMutation } from 'react-query';
import { saveAs } from 'file-saver';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { buildUrl } from './backupSettings.service';

export interface DownloadBackupPayload {
  password: string;
}

export function useDownloadBackupMutation() {
  return useMutation(downloadBackup, {
    ...withGlobalError('无法下载备份'),
  });
}

async function downloadBackup(payload: DownloadBackupPayload) {
  try {
    const response = await axios.post(buildUrl(), payload, {
      responseType: 'arraybuffer',
    });

    const file = response.data;
    const filename = response.headers['content-disposition'].replace(
      'attachment; filename=',
      ''
    );
    const blob = new Blob([file], { type: 'application/zip' });
    return saveAs(blob, filename);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法下载备份');
  }
}
