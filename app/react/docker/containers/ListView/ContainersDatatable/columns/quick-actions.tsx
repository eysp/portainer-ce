import { CellContext } from '@tanstack/react-table';

import { useAuthorizations } from '@/react/hooks/useUser';
import { ContainerQuickActions } from '@/react/docker/containers/components/ContainerQuickActions';
import { ContainerListViewModel } from '@/react/docker/containers/types';

import { useTableSettings } from '@@/datatables/useTableSettings';

import { TableSettings } from '../types';

import { columnHelper } from './helper';

export const quickActions = columnHelper.display({
  header: '快速操作',
  id: 'actions',
  cell: QuickActionsCell,
});

function QuickActionsCell({
  row: { original: container },
}: CellContext<ContainerListViewModel, unknown>) {
  const settings = useTableSettings<TableSettings>();

  const { hiddenQuickActions = [] } = settings;

  const wrapperState = {
    showQuickActionAttach: !hiddenQuickActions.includes('附加'),
    showQuickActionExec: !hiddenQuickActions.includes('执行'),
    showQuickActionInspect: !hiddenQuickActions.includes('检查'),
    showQuickActionLogs: !hiddenQuickActions.includes('日志'),
    showQuickActionStats: !hiddenQuickActions.includes('统计'),
  };

  const someOn =
    wrapperState.showQuickActionAttach ||
    wrapperState.showQuickActionExec ||
    wrapperState.showQuickActionInspect ||
    wrapperState.showQuickActionLogs ||
    wrapperState.showQuickActionStats;

  const { authorized } = useAuthorizations([
    'DockerContainerStats',
    'DockerContainerLogs',
    'DockerExecStart',
    'DockerContainerInspect',
    'DockerTaskInspect',
    'DockerTaskLogs',
  ]);

  if (!someOn || !authorized) {
    return null;
  }

  return (
    <ContainerQuickActions
      containerId={container.Id}
      nodeName={container.NodeName}
      status={container.Status}
      state={wrapperState}
    />
  );
}
