import { columnHelper } from './helper';

export const host = columnHelper.accessor('nodeName', {
  header: '宿主机',
  cell: ({ getValue }) => {
    const value = getValue();
    return value || '-';
  },
});
