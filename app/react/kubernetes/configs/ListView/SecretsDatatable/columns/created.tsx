import { formatDate } from '@/portainer/filters/filters';

import { SecretRowData } from '../types';

import { columnHelper } from './helper';

export const created = columnHelper.accessor((row) => getCreatedAtText(row), {
  header: '创建时间',
  id: 'created',
  cell: ({ row }) => getCreatedAtText(row.original),
});

function getCreatedAtText(row: SecretRowData) {
  const owner = row.ConfigurationOwner || row.ConfigurationOwnerId;
  const date = formatDate(row.CreationDate);
  return owner ? `${date} 由 ${owner}` : date;
}
