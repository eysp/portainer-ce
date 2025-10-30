import { SystemBadge } from '@@/Badge/SystemBadge';

import { columnHelper } from './helper';

export const name = columnHelper.accessor(
  (row) => {
    let result = row.Name;
    if (row.IsSystem) {
      result += ' system';
    }
    return result;
  },
  {
    header: 'Name',
    id: 'name',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.Name}
        {row.original.IsSystem && <SystemBadge className="ml-auto" />}
      </div>
    ),
  }
);
