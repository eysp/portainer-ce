import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const created = columnHelper.accessor(
  (row) => isoDateFromTimestamp(row.Created),
  {
    header: '创建时间',
    id: 'created',
    cell: ({ row }) => isoDateFromTimestamp(row.original.Created),
  }
);
