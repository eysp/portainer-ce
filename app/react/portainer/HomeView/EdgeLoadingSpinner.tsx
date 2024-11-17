import clsx from 'clsx';
import { Settings } from 'lucide-react';

import { Icon } from '@@/Icon';

import styles from './EdgeLoadingSpinner.module.css';

export function EdgeLoadingSpinner() {
  return (
    <div className={clsx('row', styles.root)}>
      正在连接到边缘环境...
      <Icon icon={Settings} className="!ml-1 animate-spin-slow" />
    </div>
  );
}
