import { columnHelper } from './helper';

export const className = columnHelper.accessor('ClassName', {
  header: '类名',
  id: 'className',
  cell: ({ row }) => row.original.ClassName || '-',
});
