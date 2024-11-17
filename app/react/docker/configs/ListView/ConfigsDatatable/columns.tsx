import { createColumnHelper } from '@tanstack/react-table';

import { isoDate } from '@/portainer/filters/filters';
import { createOwnershipColumn } from '@/react/docker/components/datatables/createOwnershipColumn';

import { buildNameColumn } from '@@/datatables/buildNameColumn';

import { DockerConfig } from '../../types';

const columnHelper = createColumnHelper<DockerConfig>();

export const columns = [
  buildNameColumn<DockerConfig>('Name', 'docker.configs.config'),
  columnHelper.accessor('CreatedAt', {
    header: '创建日期',
    cell: ({ getValue }) => {
      const date = getValue();
      return <time dateTime={date}>{isoDate(date)}</time>;
    },
  }),
  createOwnershipColumn<DockerConfig>(),
];
