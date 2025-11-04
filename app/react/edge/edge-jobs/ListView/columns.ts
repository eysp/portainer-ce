import { createColumnHelper } from '@tanstack/react-table';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { buildNameColumn } from '@@/datatables/buildNameColumn';

import { EdgeJob } from '../types';

const columnHelper = createColumnHelper<EdgeJob>();

export const columns = [
  buildNameColumn<EdgeJob>('Name', '.job', 'edge-job-name'),
  columnHelper.accessor('CronExpression', {
    header: 'Cron 表达式',
  }),
  columnHelper.accessor('Created', {
    header: '创建时间',
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
  }),
];
