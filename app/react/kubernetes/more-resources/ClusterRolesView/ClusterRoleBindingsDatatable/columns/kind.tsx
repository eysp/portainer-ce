import { columnHelper } from './helper';

export const kind = columnHelper.accessor('roleRef.kind', {
  header: '角色类型',
  id: 'roleKind',
});
