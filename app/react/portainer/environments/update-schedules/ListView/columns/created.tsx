import { Column } from 'react-table';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { EdgeUpdateSchedule } from '../../types';

export const created: Column<EdgeUpdateSchedule> = {
  Header: '创建于',
  accessor: (row) => isoDateFromTimestamp(row.created),
  disableFilters: true,
  Filter: () => null,
  canHide: false,
};
