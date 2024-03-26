import { columnHelper } from './helper';

export const status = columnHelper.accessor('Status', {
  header: '作业状态',
  id: 'status',
  cell: ({ getValue }) => {
    const value = getValue();
    return value || '-';
  },
});
