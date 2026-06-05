import { CellContext } from '@tanstack/react-table';

import { ServiceRowData } from '../types';

import { columnHelper } from './helper';

export const externalHost = columnHelper.accessor(
  (row) => {
    if (row.Type === 'ExternalName') {
      return row.ExternalName || '-';
    }

    return (
      row.IngressStatus?.map((status) => status.Hostname)
        .filter(Boolean)
        .join(' ,') || '-'
    );
  },
  {
    header: '外部主机',
    id: 'externalHost',
    cell: Cell,
  }
);

function Cell({ row }: CellContext<ServiceRowData, string>) {
  if (row.original.Type === 'ExternalName') {
    return <div>{row.original.ExternalName || '-'}</div>;
  }

  return (
    <div>
      {row.original.IngressStatus?.map((status) => status.Hostname)
        .filter(Boolean)
        .join(' ,') || '-'}
    </div>
  );
}
