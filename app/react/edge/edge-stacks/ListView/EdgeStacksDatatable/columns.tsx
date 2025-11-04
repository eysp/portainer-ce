import { createColumnHelper } from '@tanstack/react-table';
import _ from 'lodash';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import { GitCommitLink } from '@/react/portainer/gitops/GitCommitLink';

import { buildNameColumnFromObject } from '@@/datatables/buildNameColumn';
import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';

import { StatusType } from '../../types';

import { EdgeStackStatus } from './EdgeStacksStatus';
import { DecoratedEdgeStack } from './types';
import { DeploymentCounter } from './DeploymentCounter';

const columnHelper = createColumnHelper<DecoratedEdgeStack>();

export const columns = _.compact([
  buildNameColumnFromObject<DecoratedEdgeStack>({
    nameKey: 'Name',
    path: 'edge.stacks.edit',
    dataCy: 'edge-stacks-name',
    idParam: 'stackId',
  }),
  columnHelper.accessor(
    (item) =>
      item.StatusSummary?.AggregatedStatus?.[StatusType.Acknowledged] || 0,
    {
      header: '已确认',
      enableSorting: false,
      enableHiding: false,
      cell: ({ getValue, row }) => (
        <DeploymentCounter
          count={getValue()}
          type={StatusType.Acknowledged}
          total={row.original.NumDeployments}
        />
      ),
      meta: {
        className: '[&>*]:justify-center',
      },
    }
  ),
  isBE &&
    columnHelper.accessor(
      (item) =>
        item.StatusSummary?.AggregatedStatus?.[StatusType.ImagesPulled] || 0,
      {
        header: '镜像预拉取',
        cell: ({ getValue, row: { original: item } }) => {
          if (!item.PrePullImage) {
            return <div className="text-center">-</div>;
          }

          return (
            <DeploymentCounter
              count={getValue()}
              type={StatusType.ImagesPulled}
              total={item.NumDeployments}
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: '[&>*]:justify-center',
        },
      }
    ),
  columnHelper.accessor(
    (item) =>
      item.StatusSummary?.AggregatedStatus?.[StatusType.DeploymentReceived] ||
      0,
    {
      header: '已接收部署',
      cell: ({ getValue, row }) => (
        <DeploymentCounter
          count={getValue()}
          type={StatusType.Running}
          total={row.original.NumDeployments}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: '[&>*]:justify-center',
      },
    }
  ),
  columnHelper.accessor(
    (item) => item.StatusSummary?.AggregatedStatus?.[StatusType.Error] || 0,
    {
      header: '部署失败',
      cell: ({ getValue, row }) => {
        const count = getValue();

        return (
          <div className="flex items-center gap-2">
            <DeploymentCounter
              count={count}
              type={StatusType.Error}
              total={row.original.NumDeployments}
            />
            {count > 0 && (
              <Link
                className="hover:no-underline"
                to="edge.stacks.edit"
                params={{
                  stackId: row.original.Id,
                  tab: 'environments',
                  status: StatusType.Error,
                }}
                data-cy={`edge-stacks-error-${row.original.Id}`}
              >
                ({count}/{row.original.NumDeployments})
              </Link>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: '[&>*]:justify-center',
      },
    }
  ),
  columnHelper.accessor('Status', {
    header: StatusHeader,
    cell: ({ row }) => (
      <div className="w-full text-center">
        <EdgeStackStatus edgeStack={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: '[&>*]:justify-center',
    },
  }),
  columnHelper.accessor('CreationDate', {
    header: '创建日期',
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
    enableHiding: false,
  }),
  isBE &&
    columnHelper.accessor(
      (item) =>
        item.GitConfig ? item.GitConfig.ConfigHash : item.StackFileVersion,
      {
        header: '目标版本',
        enableSorting: false,
        cell: ({ row: { original: item } }) => {
          if (item.GitConfig) {
            return (
              <div className="text-center">
                <GitCommitLink
                  baseURL={item.GitConfig.URL}
                  commitHash={item.GitConfig.ConfigHash}
                />
              </div>
            );
          }

          return <div className="text-center">{item.StackFileVersion}</div>;
        },
        meta: {
          className: '[&>*]:justify-center',
        },
      }
    ),
]);

function StatusHeader() {
  return (
    <>
      状态
      <Tooltip
        position="top"
        message={
          <>
            <div>
              边缘堆栈的状态功能仅适用于边缘代理 2.19.0 及以上版本。
            </div>
            <div>
              要访问边缘堆栈的状态，必须将边缘代理升级到与 Portainer 服务器兼容的相应版本。
            </div>
          </>
        }
      />
    </>
  );
}
