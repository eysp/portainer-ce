import { Eye, Moon, Sun, RefreshCw } from 'lucide-react';

import { BadgeIcon } from '@@/BadgeIcon';

export const options = [
  {
    id: 'light',
    icon: <BadgeIcon icon={Sun} />,
    label: '浅色主题',
    description: '默认颜色模式',
    value: 'light',
  },
  {
    id: 'dark',
    icon: <BadgeIcon icon={Moon} />,
    label: '深色主题',
    description: '深色颜色模式',
    value: 'dark',
  },
  {
    id: 'highcontrast',
    icon: <BadgeIcon icon={Eye} />,
    label: '高对比度',
    description: '高对比度颜色模式',
    value: 'highcontrast',
  },
  {
    id: 'auto',
    icon: <BadgeIcon icon={RefreshCw} />,
    label: '自动',
    description: '同步系统主题',
    value: 'auto',
  },
];
