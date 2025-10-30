import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';

import type { IngressControllerClassMap } from '../../types';

import { columnHelper } from './helper';

export const name = columnHelper.accessor('ClassName', {
  header: 'Ingress class',
  cell: NameCell,
  id: 'name',
});

function NameCell({
  row,
  getValue,
}: CellContext<IngressControllerClassMap, string>) {
  const className = getValue();

  return (
    <span className="flex gap-2 flex-nowrap">
      {className}
      {row.original.New && <Badge className="ml-auto">Newly detected</Badge>}
    </span>
  );
}
