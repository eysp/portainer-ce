import { formatDate } from '@/portainer/filters/filters';

import { FORMAT } from '../../common/ScheduledTimeField';

import { columnHelper } from './helper';

export const scheduledTime = columnHelper.accessor('scheduledTime', {
  header: '计划时间和日期',
  // make sure the value has the right format
  cell: ({ getValue }) => formatDate(getValue(), FORMAT, FORMAT),
  id: 'time',
});
