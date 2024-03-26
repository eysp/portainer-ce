import { DownloadCloud, UploadCloud } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { BadgeIcon } from '@@/BadgeIcon';

export enum BackupFormType {
  S3 = 's3',
  File = 'file',
}

export const options = [
  {
    id: 'backup_file',
    icon: <BadgeIcon icon={DownloadCloud} />,
    label: '下载备份文件',
    value: BackupFormType.File,
  },
  {
    id: 'backup_s3',
    icon: <BadgeIcon icon={UploadCloud} />,
    label: '存储至 S3',
    description: '定义一个 Cron 计划',
    value: BackupFormType.S3,
    feature: FeatureId.S3_BACKUP_SETTING,
  },
];
