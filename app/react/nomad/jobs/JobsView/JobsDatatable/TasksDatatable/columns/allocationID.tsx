import { columnHelper } from './helper';

export const allocationID = columnHelper.accessor('AllocationID', {
  header: '分配 ID',
  id: 'allocationID',
  cell: ({ getValue }) => {
    const value = getValue();
    return value || '-';
  },
});
