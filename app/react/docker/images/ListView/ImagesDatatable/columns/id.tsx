import { CellContext, Column } from '@tanstack/react-table';
import { useSref } from '@uirouter/react';

import { truncate } from '@/portainer/filters/filters';
import { getValueAsArrayOfStrings } from '@/portainer/helpers/array';
import { ImagesListResponse } from '@/react/docker/images/queries/useImages';

import { MultipleSelectionFilter } from '@@/datatables/Filter';

import { columnHelper } from './helper';

export const id = columnHelper.accessor('id', {
  id: 'id',
  header: 'Id',
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
      menuTitle="按使用状况筛选"
    />
  );
}

function Cell({
  getValue,
  row: { original: image },
}: CellContext<ImagesListResponse, string>) {
  const name = getValue();

  const linkProps = useSref('.image', {
    id: image.id,
    imageId: image.id,
  });

  return (
    <>
      <a href={linkProps.href} onClick={linkProps.onClick} title={name}>
        {truncate(name, 40)}
      </a>
      {!image.used && (
        <span className="label label-warning image-tag ml-2">未使用</span>
      )}
    </>
  );
}
