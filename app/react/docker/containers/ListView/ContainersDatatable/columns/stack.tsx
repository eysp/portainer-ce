import { columnHelper } from './helper';

export const stack = columnHelper.accessor((row) => row.StackName || '-', {
  header: '所属堆栈',
  id: 'stack',
});
