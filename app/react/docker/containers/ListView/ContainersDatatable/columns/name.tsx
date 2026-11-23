import { CellContext } from '@tanstack/react-table';
import _ from 'lodash';

import type { ContainerListViewModel } from '@/react/docker/containers/types';

import { useTableSettings } from '@@/datatables/useTableSettings';
import { Link } from '@@/Link';

import { TableSettings } from '../types';

import { columnHelper } from './helper';

export const name = columnHelper.accessor((row) => row.Names[0], {
  header: '名称',
  id: 'name',
  cell: NameCell,
});

export function NameCell({
  getValue,
  row: { original: container },
}: CellContext<ContainerListViewModel, string>) {
  const name = getValue();

  const settings = useTableSettings<TableSettings>();
  const truncate = settings.truncateContainerName;

  let shortName = name;
  if (truncate > 0) {
    shortName = _.truncate(name, { length: truncate });
  }

  return (
    <Link
      to=".container"
      params={{ id: container.Id, nodeName: container.NodeName }}
      title={name}
      data-cy={`container-name-link-${container.Id}`}
    >
      {shortName}
    </Link>
  );
}
