import _ from 'lodash';
import { useMemo } from 'react';

import { useIsSwarm } from '@/react/docker/proxy/queries/useInfo';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { createOwnershipColumn } from '@/react/docker/components/datatables/createOwnershipColumn';
import { isoDate, truncateLeftRight } from '@/portainer/filters/filters';

import { DecoratedVolume } from '../../types';

import { columnHelper } from './helper';
import { name } from './name';

export function useColumns() {
  const environmentId = useEnvironmentId();
  const isSwarm = useIsSwarm(environmentId);

  return useMemo(
    () =>
      _.compact([
        name,
        columnHelper.accessor((item) => item.StackName || '-', {
          header: '堆栈',
        }),
        columnHelper.accessor((item) => item.Driver, {
          header: '驱动',
        }),
        columnHelper.accessor((item) => item.Mountpoint, {
          header: '挂载点',
          cell({ getValue }) {
            return truncateLeftRight(getValue());
          },
        }),
        columnHelper.accessor((item) => item.CreatedAt, {
          header: '创建时间',
          cell({ getValue }) {
            return isoDate(getValue());
          },
        }),
        isSwarm &&
          columnHelper.accessor((item) => item.NodeName || '-', {
            header: '主机',
          }),
        createOwnershipColumn<DecoratedVolume>(),
      ]),
    [isSwarm]
  );
}
