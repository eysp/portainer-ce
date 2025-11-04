import { columnHelper } from './helper';
import { name } from './name';

export const columns = [
  name,
  columnHelper.accessor((group) => group.TrustedEndpoints.length, {
    header: '环境数量',
  }),
  columnHelper.accessor('Dynamic', {
    header: '分组类型',
    cell: ({ getValue }) => (getValue() ? '动态' : '静态'),
  }),
];
