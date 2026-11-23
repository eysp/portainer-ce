import { createColumnHelper } from '@tanstack/react-table';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { AccessToken } from '../../access-tokens/types';

const columnHelper = createColumnHelper<AccessToken>();

export const columns = [
  columnHelper.accessor('description', {
    header: '描述',
  }),
  columnHelper.accessor('prefix', {
    header: '前缀',
  }),
  columnHelper.accessor('dateCreated', {
    header: '创建时间',
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
  }),
  columnHelper.accessor('lastUsed', {
    header: '最后使用',
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
  }),
];
