import clsx from 'clsx';
import { AriaAttributes, PropsWithChildren } from 'react';

import { Icon, IconProps } from '@@/Icon';

export type StatusBadgeType =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'successLite'
  | 'dangerLite'
  | 'warningLite'
  | 'mutedLite'
  | 'infoLite'
  | 'default';

const typeClasses: Record<StatusBadgeType, string> = {
  success: clsx(
    'text-white bg-success-7',
    'th-dark:text-white th-dark:bg-success-9'
  ),
  warning: clsx(
    'text-white bg-warning-7',
    'th-dark:text-white th-dark:bg-warning-9'
  ),
  danger: clsx(
    'text-white bg-error-7',
    'th-dark:text-white th-dark:bg-error-9'
  ),
  info: clsx('text-white bg-blue-7', 'th-dark:text-white th-dark:bg-blue-9'),
  // the lite classes are a bit lighter in light mode and the same in dark mode
  successLite: clsx(
    'text-success-9 bg-success-3',
    'th-dark:text-white th-dark:bg-success-9'
  ),
  warningLite: clsx(
    'text-warning-9 bg-warning-3',
    'th-dark:text-white th-dark:bg-warning-9'
  ),
  dangerLite: clsx(
    'text-error-9 bg-error-3',
    'th-dark:text-white th-dark:bg-error-9'
  ),
  mutedLite: clsx(
    'text-gray-9 bg-gray-3',
    'th-dark:text-white th-dark:bg-gray-9'
  ),
  infoLite: clsx(
    'text-blue-9 bg-blue-3',
    'th-dark:text-white th-dark:bg-blue-9'
  ),
  default: '',
};

export function StatusBadge({
  className,
  children,
  color = 'default',
  icon,
  ...aria
}: PropsWithChildren<
  {
    className?: string;
    color?: StatusBadgeType;
    icon?: IconProps['icon'];
  } & AriaAttributes
>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded',
        'w-fit px-1.5 py-0.5',
        'text-sm font-medium',
        typeClasses[color],
        className
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...aria}
    >
      {icon && (
        <Icon
          icon={icon}
          className={clsx({
            '!text-green-7': color === 'success',
            '!text-warning-7': color === 'warning',
            '!text-error-7': color === 'danger',
          })}
        />
      )}

      {children}
    </span>
  );
}
