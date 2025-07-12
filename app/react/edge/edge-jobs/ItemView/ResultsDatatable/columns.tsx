import { CellContext, createColumnHelper } from '@tanstack/react-table';

import { Button } from '@@/buttons';

import { LogsStatus } from '../../types';
import { useDownloadLogsMutation } from '../../queries/jobResults/useDownloadLogsMutation';
import { useClearLogsMutation } from '../../queries/jobResults/useClearLogsMutation';
import { useCollectLogsMutation } from '../../queries/jobResults/useCollectLogsMutation';

import { DecoratedJobResult, getTableMeta } from './types';

const columnHelper = createColumnHelper<DecoratedJobResult>();

export const columns = [
  columnHelper.accessor('Endpoint.Name', {
    header: '环境',
    meta: {
      className: 'w-1/2',
    },
  }),
  columnHelper.display({
    header: '操作',
    cell: ActionsCell,
    meta: {
      className: 'w-1/2',
    },
  }),
];

function ActionsCell({
  row: { original: item },
  table,
}: CellContext<DecoratedJobResult, unknown>) {
  const tableMeta = getTableMeta(table.options.meta);
  const id = tableMeta.jobId;

  const downloadLogsMutation = useDownloadLogsMutation(id);
  const clearLogsMutations = useClearLogsMutation(id);
  const collectLogsMutation = useCollectLogsMutation(id);

  switch (item.LogsStatus) {
    case LogsStatus.Pending:
      return (
        <>
          日志已标记为收集中，请等待日志可用。
        </>
      );

    case LogsStatus.Collected:
      return (
        <>
          <Button
            onClick={() => downloadLogsMutation.mutate(item.EndpointId)}
            data-cy={`edge-job-download-logs-${item.Endpoint?.Name}`}
          >
            下载日志
          </Button>
          <Button
            onClick={() => clearLogsMutations.mutate(item.EndpointId)}
            data-cy={`edge-job-clear-logs-${item.Endpoint?.Name}`}
          >
            清除日志
          </Button>
        </>
      );
    case LogsStatus.Idle:
    default:
      return (
        <Button
          onClick={() => collectLogsMutation.mutate(item.EndpointId)}
          data-cy={`edge-job-retrieve-logs-${item.Endpoint?.Name}`}
        >
          获取日志
        </Button>
      );
  }
}
