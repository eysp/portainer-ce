import { isoDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const updated = columnHelper.accessor('Updated', {
  header: '最后更新',
  cell: ({ getValue }) => isoDate(getValue()),
});
