import { CellContext } from '@tanstack/react-table';

import { StatusType } from '../../types';
import { DecoratedItem } from '../types';

import { columnHelper } from './helper';

export const scheduleStatus = columnHelper.accessor('status', {
  header: '状态',
  cell: StatusCell,
});

function StatusCell({
  getValue,
  row: {
    original: { statusMessage },
  },
}: CellContext<DecoratedItem, DecoratedItem['status']>) {
  const status = getValue();

  switch (status) {
    case StatusType.Failed:
      return statusMessage;
    case StatusType.Pending:
      return '待处理';
    case StatusType.Success:
      return '成功';
    case StatusType.Sent:
      return '已发送';
    default:
      return StatusType[status];
  }
}
