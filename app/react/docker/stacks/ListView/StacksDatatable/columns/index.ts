import _ from 'lodash';

import { StackType } from '@/react/common/stacks/types';
import { isoDateFromTimestamp } from '@/portainer/filters/filters';
import { createOwnershipColumn } from '@/react/docker/components/datatables/createOwnershipColumn';

import { DecoratedStack } from '../types';

import { columnHelper } from './helper';
import { name } from './name';
import { imageNotificationColumn } from './image-notification';
import { control } from './control';

export function useColumns(isImageNotificationEnabled: boolean) {
  return _.compact([
    name,
    columnHelper.accessor(
      (item) => (item.Type === StackType.DockerCompose ? 'Compose' : 'Swarm'),
      {
        id: 'type',
        header: '类型',
        enableHiding: false,
      }
    ),
    isImageNotificationEnabled && imageNotificationColumn,
    control,
    columnHelper.accessor('CreationDate', {
      id: 'creationDate',
      header: '创建时间',
      enableHiding: false,
      cell: ({ getValue, row: { original: item } }) => {
        const value = getValue();
        if (!value) {
          return '-';
        }

        const by = item.CreatedBy ? `by ${item.CreatedBy}` : '';
        return `${isoDateFromTimestamp(value)} ${by}`.trim();
      },
    }),
    columnHelper.accessor('UpdateDate', {
      id: 'updateDate',
      header: '更新日期',
      cell: ({ getValue, row: { original: item } }) => {
        const value = getValue();
        if (!value) {
          return '-';
        }

        const by = item.UpdatedBy ? `by ${item.UpdatedBy}` : '';
        return `${isoDateFromTimestamp(value)} ${by}`.trim();
      },
    }),
    createOwnershipColumn<DecoratedStack>(false),
  ]);
}
