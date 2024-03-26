import { columnHelper } from './helper';

export const stack = columnHelper.accessor((row) => row.StackName || '-', {
  header: '堆栈',
  id: 'stack',
});
