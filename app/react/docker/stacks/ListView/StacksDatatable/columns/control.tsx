import { CellContext } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { PropsWithChildren } from 'react';

import {
  isExternalStack,
  isOrphanedStack,
  isRegularStack,
} from '@/react/docker/stacks/view-models/utils';

import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Icon } from '@@/Icon';

import { DecoratedStack } from '../types';

import { columnHelper } from './helper';

export const control = columnHelper.display({
  header: '控制',
  id: 'control',
  cell: ControlCell,
  enableHiding: false,
});

function ControlCell({
  row: { original: item },
}: CellContext<DecoratedStack, unknown>) {
  if (isRegularStack(item)) {
    return <>Total</>;
  }

  if (isExternalStack(item)) {
    return (
      <Warning tooltip="此堆栈是在 Portainer 之外创建的，对该堆栈的控制有限。">
        有限制
      </Warning>
    );
  }

  if (isOrphanedStack(item)) {
    return (
      <Warning tooltip="此堆栈是在不再注册在 Portainer 中的环境内创建的。">
        孤立
      </Warning>
    );
  }

  return null;
}

function Warning({
  tooltip,
  children,
}: PropsWithChildren<{ tooltip: string }>) {
  return (
    <TooltipWithChildren message={tooltip}>
      <span className="flex items-center gap-2">
        {children}
        <Icon icon={AlertCircle} mode="warning" />
      </span>
    </TooltipWithChildren>
  );
}
