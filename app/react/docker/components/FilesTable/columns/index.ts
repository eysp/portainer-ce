import {
  CellContext,
  ColumnDef,
  ColumnDefTemplate,
} from '@tanstack/react-table';

import { humanize, isoDateFromTimestamp } from '@/portainer/filters/filters';

import { FileData } from '../types';

import { columnHelper } from './helper';
import { NameCell } from './NameCell';
import { ActionsCell } from './ActionsCell';

export const columns = [
  columnHelper.accessor('Name', {
    header: '名称',
    cell: NameCell,
  }),
  columnHelper.accessor('Size', {
    header: '大小',
    cell: hideIfCustom(({ getValue }) => humanize(getValue())),
  }),
  columnHelper.accessor('ModTime', {
    header: '最后修改时间',
    cell: hideIfCustom(({ getValue }) => isoDateFromTimestamp(getValue())),
  }),
  columnHelper.display({
    header: '操作',
    cell: hideIfCustom(ActionsCell),
  }),
  columnHelper.accessor('Dir', {}), // workaround, to enable sorting by Dir (put directory first)
] as ColumnDef<FileData>[];

function hideIfCustom<TValue>(
  template: ColumnDefTemplate<CellContext<FileData, TValue>>
): ColumnDefTemplate<CellContext<FileData, TValue>> {
  return (props) => {
    if (props.row.original.custom) {
      return null;
    }
    return typeof template === 'string' ? template : template(props);
  };
}
