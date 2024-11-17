import { buildExpandColumn } from '@@/datatables/expand-column';
import { buildNameColumnFromObject } from '@@/datatables/buildNameColumn';

import { TableNetwork } from './types';
import { columnHelper } from './helper';
import { buildActions } from './actions';

export function buildColumns({ nodeName }: { nodeName?: string } = {}) {
  return [
    buildExpandColumn<TableNetwork>(),
    {
      ...buildNameColumnFromObject<TableNetwork>({
        nameKey: 'name',
        path: 'docker.networks.network',
        linkParamsBuilder: () => ({ nodeName }),
      }),
      header: '网络',
    },
    columnHelper.accessor((item) => item.IPAddress || '-', {
      header: 'IP 地址',
      id: 'ip',
      enableSorting: false,
    }),
    columnHelper.accessor((item) => item.Gateway || '-', {
      header: '网关',
      id: 'gateway',
      enableSorting: false,
    }),
    columnHelper.accessor((item) => item.MacAddress || '-', {
      header: 'MAC 地址',
      id: 'macAddress',
      enableSorting: false,
    }),
    buildActions({ nodeName }),
  ];
}
