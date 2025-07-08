import { FileText } from 'lucide-react';
import { CellContext, createColumnHelper } from '@tanstack/react-table';

import { useIsSystemNamespace } from '@/react/kubernetes/namespaces/queries/useIsSystemNamespace';

import { buildExpandColumn } from '@@/datatables/expand-column';
import { Link } from '@@/Link';
import { Icon } from '@@/Icon';
import { SystemBadge } from '@@/Badge/SystemBadge';

import { Stack } from './types';

export const columnHelper = createColumnHelper<Stack>();

const namespace = columnHelper.accessor('ResourcePool', {
  id: 'namespace',
  header: 'Namespace',
  cell: NamespaceCell,
});

function NamespaceCell({ row, getValue }: CellContext<Stack, string>) {
  const value = getValue();
  const isSystem = useIsSystemNamespace(value);
  return (
    <div className="flex gap-2">
      <Link
        to="kubernetes.resourcePools.resourcePool"
        params={{ id: value }}
        data-cy={`app-stack-namespace-link-${row.original.Name}`}
      >
        {value}
      </Link>
      {isSystem && <SystemBadge />}
    </div>
  );
}

const name = columnHelper.accessor('Name', {
  id: 'name',
  header: '堆栈',
});

const applications = columnHelper.accessor((row) => row.Applications.length, {
  id: 'applications',
  header: '应用程序',
});

const actions = columnHelper.display({
  id: 'actions',
  header: '操作',
  cell: ({ row: { original: item } }) => (
    <Link
      to="kubernetes.stacks.stack.logs"
      params={{ namespace: item.ResourcePool, name: item.Name }}
      className="flex items-center gap-1"
      data-cy={`app-stack-logs-link-${item.Name}`}
    >
      <Icon icon={FileText} />
      日志
    </Link>
  ),
});

export const columns = [
  buildExpandColumn<Stack>(),
  name,
  namespace,
  applications,
  actions,
];
