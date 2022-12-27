import { Column } from 'react-table';

import type { DockerContainer } from '@/react/docker/containers/types';

export const ip: Column<DockerContainer> = {
  Header: 'IP 地址',
  accessor: (row) => row.IP || '-',
  id: 'ip',
  disableFilters: true,
  canHide: true,
  Filter: () => null,
};
