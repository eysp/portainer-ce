import { columnHelper } from './helper';

export const taskGroup = columnHelper.accessor('TaskGroup', {
  header: '任务组',
  id: 'taskGroup',
  cell: ({ getValue }) => {
    const value = getValue();
    return value || '-';
  },
});
