import clsx from 'clsx';
import { PropsWithChildren, ReactNode } from 'react';

import { WidgetIcon } from './WidgetIcon';
import { useWidgetContext } from './Widget';

interface Props {
  title: ReactNode;
  icon: ReactNode;
  className?: string;
}

export function WidgetTitle({
  title,
  icon,
  className,
  children,
}: PropsWithChildren<Props>) {
  const { titleId } = useWidgetContext();

  return (
    <div className="widget-header">
      <div className="row">
        <span className={clsx('pull-left vertical-center', className)}>
          <WidgetIcon icon={icon} />
          <h2 id={titleId} className="text-base m-0 ml-1">
            {title}
          </h2>
        </span>
        <span className={clsx('pull-right', className)}>{children}</span>
      </div>
    </div>
  );
}
