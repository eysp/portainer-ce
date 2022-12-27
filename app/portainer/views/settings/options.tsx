import { DownloadCloud, UploadCloud } from 'react-feather';

import { FeatureId } from '@/portainer/feature-flags/enums';

import { BadgeIcon } from '@@/BoxSelector/BadgeIcon';

export const options = [
  {
    id: 'backup_file',
    icon: <BadgeIcon icon={DownloadCloud} />,
    featherIcon: true,
    label: '下载备份文件',
    value: 'file',
  },
  {
    id: 'backup_s3',
    icon: <BadgeIcon icon={UploadCloud} />,
    featherIcon: true,
    label: 'Store in S3',
    description: '定义cron计划',
    value: 's3',
    feature: FeatureId.S3_BACKUP_SETTING,
  },
];
