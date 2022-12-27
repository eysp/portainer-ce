import Lightmode from '@/assets/ico/theme/lightmode.svg?c';
import Darkmode from '@/assets/ico/theme/darkmode.svg?c';
import Highcontrastmode from '@/assets/ico/theme/highcontrastmode.svg?c';
import Automode from '@/assets/ico/theme/auto.svg?c';

export const options = [
  {
    id: 'light',
    icon: Lightmode,
    label: '浅色主题',
    description: '默认颜色模式',
    value: 'light',
  },
  {
    id: 'dark',
    icon: Darkmode,
    label: '深色主题',
    description: '深色模式',
    value: 'dark',
  },
  {
    id: 'highcontrast',
    icon: Highcontrastmode,
    label: '高对比度',
    description: '高对比度颜色模式',
    value: 'highcontrast',
  },
  {
    id: 'auto',
    icon: Automode,
    label: '自动',
    description: '与系统主题同步',
    value: 'auto',
  },
];
