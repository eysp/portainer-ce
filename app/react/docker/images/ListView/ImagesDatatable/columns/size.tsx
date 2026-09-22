import { humanize } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const size = columnHelper.accessor('size', {
  id: 'size',
  header: '大小',
  cell: ({ getValue }) => {
    const value = getValue();
    return humanize(value) || '-';
  },
});
