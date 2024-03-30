import { Row } from '@tanstack/react-table';

import { filterHOC } from '@@/datatables/Filter';

import { Service } from '../../../types';

import { columnHelper } from './helper';

export const type = columnHelper.accessor('Type', {
  header: '类型',
  id: 'type',
  meta: {
    filter: filterHOC('按类型筛选'),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<Service>, columnId: string, filterValue: string[]) =>
    filterValue.length === 0 || filterValue.includes(row.original.Type),
});
