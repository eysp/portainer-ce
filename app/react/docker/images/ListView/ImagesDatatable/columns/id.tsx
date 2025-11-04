import { CellContext, Column } from '@tanstack/react-table';

import { truncate } from '@/portainer/filters/filters';
import { getValueAsArrayOfStrings } from '@/portainer/helpers/array';
import { ImagesListResponse } from '@/react/docker/images/queries/useImages';

import { MultipleSelectionFilter } from '@@/datatables/Filter';
import { UnusedBadge } from '@@/Badge/UnusedBadge';
import { Link } from '@@/Link';

import { columnHelper } from './helper';

export const id = columnHelper.accessor('id', {
  id: 'id',
  header: 'ID',
  cell: Cell,
  enableColumnFilter: true,
  filterFn: (
    { original: { used } },
    columnId,
    filterValue: Array<'已使用' | '未使用'>
  ) => {
    if (filterValue.length === 0) {
      return true;
    }

    if (filterValue.includes('已使用') && used) {
      return true;
    }

    if (filterValue.includes('未使用') && !used) {
      return true;
    }

    return false;
  },
  meta: {
    filter: FilterByUsage,
  },
});

function FilterByUsage<TData extends { Used: boolean }>({
  column: { getFilterValue, setFilterValue, id },
}: {
  column: Column<TData>;
}) {
  const options = ['已使用', '未使用'];

  const value = getFilterValue();

  const valueAsArray = getValueAsArrayOfStrings(value);

  return (
    <MultipleSelectionFilter
      options={options}
      filterKey={id}
      value={valueAsArray}
      onChange={setFilterValue}
      menuTitle="按使用情况筛选"
    />
  );
}

function Cell({
  row: { original: item },
}: CellContext<ImagesListResponse, string>) {
  return (
    <>
      <Link
        to=".image"
        params={{ id: item.id, nodeName: item.nodeName }}
        title={item.id}
        data-cy={`image-link-${item.id}`}
        className="mr-2"
      >
        {truncate(item.id, 40)}
      </Link>
      {!item.used && <UnusedBadge />}
    </>
  );
}
