import { Download, Upload } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { BoxSelectorOption } from '@@/BoxSelector';

export const restoreOptions: ReadonlyArray<BoxSelectorOption<string>> = [
  {
    id: 'restore_file',
    value: 'file',
    icon: Upload,
    iconType: 'badge',
    label: '上传备份文件',
  },
  {
    id: 'restore_s3',
    value: 's3',
    icon: Download,
    iconType: 'badge',
    label: '从 S3 恢复',
    feature: FeatureId.S3_RESTORE,
  },
] as const;
