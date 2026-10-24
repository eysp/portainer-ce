import { ScheduleType } from '../../types';

import { columnHelper } from './helper';

export const scheduleType = columnHelper.accessor('type', {
  header: '类型',
  cell: ({ getValue }) => {
    const value = getValue();

    switch (value) {
      case ScheduleType.Update:
        return '更新';
      case ScheduleType.Rollback:
        return '回滚';
      default:
        return ScheduleType[value];
    }
  },
});
