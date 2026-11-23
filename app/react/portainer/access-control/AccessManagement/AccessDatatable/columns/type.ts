import { helper } from './helper';

export const type = helper.accessor('Type', {
  header: '类型',
  cell: ({ getValue }) => {
    const val = getValue();
    return val === 'user' ? '用户' : val === 'team' ? '团队' : val;
  }
});
