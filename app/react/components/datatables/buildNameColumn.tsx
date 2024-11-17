import { ColumnDef, CellContext } from '@tanstack/react-table';
import { UISrefProps } from '@uirouter/react';

import { Link } from '@@/Link';

import { DefaultType } from './types';
import { defaultGetRowId } from './defaultGetRowId';

/**
 * @deprecated Use `buildNameColumnFromObject` instead
 * @todo Replace `buildNameColumnFromObject` and rename to `buildNameColumn`
 */
export function buildNameColumn<T extends DefaultType>(
  nameKey: keyof T,
  path: string,
  idParam = 'id',
  idGetter: (row: T) => string = defaultGetRowId<T>
): ColumnDef<T> {
  return buildNameColumnFromObject({
    nameKey,
    path,
    idParam,
    idGetter,
  });
}

export function buildNameColumnFromObject<T extends DefaultType>({
  nameKey,
  path,
  idParam = 'id',
  idGetter = defaultGetRowId<T>,
  linkParamsBuilder = () => ({}),
}: {
  nameKey: keyof T;
  path: string;
  idParam?: string;
  idGetter?: (row: T) => string;
  linkParamsBuilder?: (row: T) => UISrefProps['params'];
}): ColumnDef<T> {
  const cell = createCell();

  return {
    header: '名称',
    accessorKey: nameKey,
    id: 'name',
    cell,
    enableSorting: true,
    enableHiding: false,
  };

  function createCell() {
    return function NameCell({ renderValue, row }: CellContext<T, unknown>) {
      const name = renderValue() || '';

      if (typeof name !== 'string') {
        return null;
      }

      return (
        <Link
          to={path}
          params={{
            ...linkParamsBuilder(row.original),
            [idParam]: idGetter(row.original),
          }}
          title={name}
        >
          {name}
        </Link>
      );
    };
  }
}
