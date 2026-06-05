import { CellContext, createColumnHelper } from '@tanstack/react-table';

import { sortOptionsFromColumns } from '@/react/common/api/sort.types';

import { Button } from '@@/buttons';

import { JobResult, LogsStatus } from '../../types';
import { useDownloadLogsMutation } from '../../queries/jobResults/useDownloadLogsMutation';
import { useClearLogsMutation } from '../../queries/jobResults/useClearLogsMutation';
import { useCollectLogsMutation } from '../../queries/jobResults/useCollectLogsMutation';

import { getTableMeta } from './types';

const columnHelper = createColumnHelper<JobResult>();

export const columns = [
  columnHelper.accessor('EndpointName', {
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
}: CellContext<JobResult, unknown>) {
  const tableMeta = getTableMeta(table.options.meta);
  const id = tableMeta.jobId;

  const downloadLogsMutation = useDownloadLogsMutation(id);
  const clearLogsMutations = useClearLogsMutation(id);
  const collectLogsMutation = useCollectLogsMutation(id);

  switch (item.LogsStatus) {
    case LogsStatus.Pending:
      return (
        <>
          日志已标记为收集，请等待日志可用。
        </>
      );

    case LogsStatus.Collected:
      return (
        <>
          <Button
            onClick={() => downloadLogsMutation.mutate(item.EndpointId)}
            data-cy={`edge-job-download-logs-${item.EndpointName}`}
          >
            下载日志
          </Button>
          <Button
            onClick={() => clearLogsMutations.mutate(item.EndpointId)}
            data-cy={`edge-job-clear-logs-${item.EndpointName}`}
          >
            Clear logs
          </Button>
        </>
      );
    case LogsStatus.Idle:
    default:
      return (
        <Button
          onClick={() => collectLogsMutation.mutate(item.EndpointId)}
          data-cy={`edge-job-retrieve-logs-${item.EndpointName}`}
        >
          Retrieve logs
        </Button>
      );
  }
}

export const sortOptions = sortOptionsFromColumns(columns);
