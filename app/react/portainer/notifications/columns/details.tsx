import { columnHelper } from './helper';

export const details = columnHelper.accessor('details', {
  header: '详情',
  id: 'details',
  cell: ({ getValue }) => {
    const value = getValue();

    return <div className="whitespace-normal">{value}</div>;
  },
});
