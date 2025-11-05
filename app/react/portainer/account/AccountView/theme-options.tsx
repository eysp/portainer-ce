import { Eye, Moon, Sun, RefreshCw } from 'lucide-react';

import { BadgeIcon } from '@@/BadgeIcon';

export const options = [
  {
    id: 'light',
    icon: <BadgeIcon icon={Sun} />,
    label: '浅色主题',
    value: 'light',
  },
  {
    id: 'dark',
    icon: <BadgeIcon icon={Moon} />,
    label: '深色主题',
    value: 'dark',
  },
  {
    id: 'highcontrast',
    icon: <BadgeIcon icon={Eye} />,
    label: '高对比度',
    value: 'highcontrast',
  },
  {
    id: 'auto',
    icon: <BadgeIcon icon={RefreshCw} />,
    label: '系统主题',
    value: 'auto',
  },
];
