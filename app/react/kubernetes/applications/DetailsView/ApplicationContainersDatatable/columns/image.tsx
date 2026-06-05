import { columnHelper } from './helper';

export const image = columnHelper.accessor('image', {
  header: '镜像',
  cell: ({ getValue }) => (
    <div className="max-w-xs truncate" title={getValue()}>
      {getValue()}
    </div>
  ),
});
