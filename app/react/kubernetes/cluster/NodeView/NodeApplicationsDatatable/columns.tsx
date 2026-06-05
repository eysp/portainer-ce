import _, { round } from 'lodash';
import { useMemo } from 'react';

import { truncate } from '@/portainer/filters/filters';
import { usePublicSettings } from '@/react/portainer/settings/queries';
import { bytesToReadableFormat } from '@/react/kubernetes/utils';

import { Link } from '@@/Link';

import { helper } from './columns.helper';
import { name } from './columns.name';

export function useColumns() {
  const hideStacksQuery = usePublicSettings<boolean>({
    select: (settings) =>
      settings.GlobalDeploymentOptions.hideStacksFunctionality,
  });

  return useMemo(
    () =>
      _.compact([
        name,
        !hideStacksQuery.data &&
          helper.accessor('StackName', {
            header: '堆栈',
            cell: ({ getValue }) => getValue() || '-',
          }),
        helper.accessor((item) => item.ResourcePool, {
          header: '命名空间',
          cell: ({ getValue }) => {
            const namespace = getValue();
            return (
              <Link
                to="kubernetes.resourcePools.resourcePool"
                params={{ id: namespace }}
                data-cy={`namespace-link-${namespace}`}
              >
                {namespace}
              </Link>
            );
          },
        }),
        helper.accessor('Image', {
          header: '镜像',
          cell: ({ row: { original: item } }) => {
            const containersLength = item.Containers?.length || 0;
            return (
              <div title={item.Image}>
                {truncate(item.Image, 64)}
                {containersLength > 1 && <>+ {containersLength - 1}</>}
              </div>
            );
          },
        }),
        helper.accessor((row) => row.Resource?.CpuRequest, {
          header: 'CPU 预留',
          cell: ({ getValue }) =>
            typeof getValue() === 'number' ? round(getValue() || 0, 2) : '-',
        }),
        helper.accessor((row) => row.Resource?.CpuLimit, {
          header: 'CPU 限制',
          cell: ({ getValue }) =>
            typeof getValue() === 'number' ? round(getValue() || 0, 2) : '-',
        }),
        helper.accessor((row) => row.Resource?.MemoryRequest, {
          header: '内存预留',
          cell: ({ getValue }) =>
            typeof getValue() === 'number'
              ? bytesToReadableFormat(getValue() || 0)
              : '-',
        }),
        helper.accessor((row) => row.Resource?.MemoryLimit, {
          header: 'Memory Limit',
          cell: ({ getValue }) =>
            typeof getValue() === 'number'
              ? bytesToReadableFormat(getValue() || 0)
              : '-',
        }),
      ]),
    [hideStacksQuery.data]
  );
}
