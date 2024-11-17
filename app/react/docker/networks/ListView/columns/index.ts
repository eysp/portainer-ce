import _ from 'lodash';
import { useMemo } from 'react';

import { createOwnershipColumn } from '@/react/docker/components/datatables/createOwnershipColumn';

import { buildExpandColumn } from '@@/datatables/expand-column';

import { DecoratedNetwork } from '../types';

import { columnHelper } from './helper';
import { name } from './name';

export function useColumns(isHostColumnVisible?: boolean) {
  return useMemo(
    () =>
      _.compact([
        buildExpandColumn<DecoratedNetwork>(),
        name,
        columnHelper.accessor((item) => item.StackName || '-', {
          header: '堆栈',
        }),
        columnHelper.accessor('Driver', {
          header: '驱动程序',
        }),
        columnHelper.accessor('Attachable', {
          header: '可附加',
        }),
        columnHelper.accessor('IPAM.Driver', {
          header: 'IPAM 驱动程序',
        }),
        columnHelper.accessor(
          (item) => item.IPAM?.IPV4Configs?.[0]?.Subnet ?? '-',
          {
            header: 'IPV4 IPAM 子网',
          }
        ),
        columnHelper.accessor(
          (item) => item.IPAM?.IPV4Configs?.[0]?.Gateway ?? '-',
          {
            header: 'IPV4 IPAM 网关',
          }
        ),
        columnHelper.accessor(
          (item) => item.IPAM?.IPV6Configs?.[0]?.Subnet ?? '-',
          {
            header: 'IPV6 IPAM 子网',
          }
        ),
        columnHelper.accessor(
          (item) => item.IPAM?.IPV6Configs?.[0]?.Gateway ?? '-',
          {
            header: 'IPV6 IPAM 网关',
          }
        ),
        isHostColumnVisible &&
          columnHelper.accessor('NodeName', {
            header: '节点',
          }),
        createOwnershipColumn<DecoratedNetwork>(),
      ]),
    [isHostColumnVisible]
  );
}
