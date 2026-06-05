import { formatDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const creationDate = columnHelper.accessor(
  (row) => formatDate(row.creationDate),
  {
    header: '创建日期',
    cell: ({ getValue }) => getValue(),
  }
);
