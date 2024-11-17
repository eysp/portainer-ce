import { CellContext } from '@tanstack/react-table';

import { DecoratedItem } from '../types';

import { columnHelper } from './helper';

export const groups = columnHelper.accessor('edgeGroupNames', {
  header: '边缘分组',
  cell: GroupsCell,
});

export function GroupsCell({
  getValue,
}: CellContext<DecoratedItem, Array<string>>) {
  const groups = getValue();

  return groups.join(', ');
}
