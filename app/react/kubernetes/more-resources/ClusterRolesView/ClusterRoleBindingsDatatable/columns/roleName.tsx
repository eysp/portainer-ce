import { columnHelper } from './helper';

export const roleName = columnHelper.accessor('roleRef.name', {
  header: '角色名称',
  id: 'roleName',
});
