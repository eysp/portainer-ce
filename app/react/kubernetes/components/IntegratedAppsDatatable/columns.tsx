import { truncate } from '@/portainer/filters/filters';

import { helper } from './columns.helper';
import { name } from './columns.name';

export const columns = [
  name,
  helper.accessor('StackName', {
    header: '堆栈',
    cell: ({ getValue }) => getValue() || '-',
  }),

  helper.accessor('Image', {
    header: '镜像',
    cell: ({ row: { original: item } }) => (
      <>
        <span title={item.Image}>{truncate(item.Image, 64)}</span>
        {item.Containers?.length > 1 && <>+ {item.Containers.length - 1}</>}
      </>
    ),
  }),
];
