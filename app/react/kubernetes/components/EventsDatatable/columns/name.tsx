import { columnHelper } from './helper';

export const name = columnHelper.accessor(
  (event) => event.involvedObject.name ?? '-',
  {
    header: '名称',
    cell: ({ getValue }) => {
      const name = getValue();
      return (
        <span title={name} className="ellipsis max-w-sm">
          {name}
        </span>
      );
    },
  }
);
