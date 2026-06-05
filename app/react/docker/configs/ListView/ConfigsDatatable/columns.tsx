import { createColumnHelper } from '@tanstack/react-table';

import { isoDate } from '@/portainer/filters/filters';
import { createOwnershipColumn } from '@/react/docker/components/datatable/createOwnershipColumn';

import { buildNameColumnFromObject } from '@@/datatables/buildNameColumn';

import { ConfigViewModel } from '../../model';

const columnHelper = createColumnHelper<ConfigViewModel>();

export const columns = [
  buildNameColumnFromObject<ConfigViewModel>({
    nameKey: 'Name',
    path: 'docker.configs.config',
    dataCy: 'docker-configs-name',
  }),
  columnHelper.accessor('CreatedAt', {
    header: '创建日期',
    cell: ({ getValue }) => {
      const date = getValue();
      return <time dateTime={date}>{isoDate(date)}</time>;
    },
  }),
  createOwnershipColumn<ConfigViewModel>(),
];
