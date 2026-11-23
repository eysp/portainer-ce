import { isoDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const time = columnHelper.accessor('timeStamp', {
  header: '时间',
  id: 'time',
  cell: ({ getValue }) => {
    const value = getValue();

    return value ? isoDate(value) : '-';
  },
});
