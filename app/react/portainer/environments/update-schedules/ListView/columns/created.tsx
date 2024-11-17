import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const created = columnHelper.accessor('created', {
  id: 'created',
  header: '创建时间',
  cell: ({ getValue }) => {
    const value = getValue();
    return isoDateFromTimestamp(value);
  },
});
