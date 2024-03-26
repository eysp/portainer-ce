import { humanize } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const size = columnHelper.accessor('VirtualSize', {
  id: 'size',
  header: '大小',
  cell: ({ getValue }) => {
    const value = getValue();
    return humanize(value) || '-';
  },
});
