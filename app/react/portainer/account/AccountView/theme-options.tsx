import { Eye, Moon, Sun, RefreshCw } from 'lucide-react';

import { BadgeIcon } from '@@/BadgeIcon';

export const options = [
  {
    id: 'light',
    icon: <BadgeIcon icon={Sun} />,
    label: '亮色主题',
    description: '默认颜色模式',
    value: 'light',
  },
  {
    id: 'dark',
    icon: <BadgeIcon icon={Moon} />,
    label: '暗色主题',
    description: '暗色模式',
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
    description: '与系统主题同步',
    value: 'auto',
  },
];
