import { columnHelper } from './helper';

export const command = columnHelper.accessor((row) => row.Command, {
  header: '命令',
  id: 'command',
  cell: ({ getValue }) => getValue() ?? '',
});
