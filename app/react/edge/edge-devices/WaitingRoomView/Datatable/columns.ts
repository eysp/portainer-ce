import moment from 'moment';
import { createColumnHelper } from '@tanstack/react-table';

import { WaitingRoomEnvironment } from '../types';

const columnHelper = createColumnHelper<WaitingRoomEnvironment>();

export const columns = [
  columnHelper.accessor('Name', {
    header: '名称',
    id: 'name',
  }),
  columnHelper.accessor('EdgeID', {
    header: '边缘ID',
    id: 'edge-id',
  }),
  columnHelper.accessor((row) => row.EdgeGroups.join(', ') || '-', {
    header: '边缘组',
    id: 'edge-groups',
  }),
  columnHelper.accessor((row) => row.Group || '-', {
    header: '组',
    id: 'group',
  }),
  columnHelper.accessor((row) => row.Tags.join(', ') || '-', {
    header: '标签',
    id: 'tags',
  }),
  columnHelper.accessor((row) => row.LastCheckInDate, {
    header: '上次签到',
    id: 'last-check-in',
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? moment(value * 1000).fromNow() : '-';
    },
  }),
];
