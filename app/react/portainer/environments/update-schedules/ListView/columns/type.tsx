import { ScheduleType } from '../../types';

import { columnHelper } from './helper';

export const scheduleType = columnHelper.accessor('type', {
  header: '类型',
  cell: ({ getValue }) => {
    const value = getValue();

    return ScheduleType[value];
  },
});
