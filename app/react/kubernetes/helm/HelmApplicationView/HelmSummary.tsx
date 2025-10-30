import { Badge } from '@/react/components/Badge';
import { localizeDate } from '@/react/common/date-utils';

import { Alert } from '@@/Alert';

import { HelmRelease } from '../types';
import {
  DeploymentStatus,
  getStatusColor,
  getStatusText,
} from '../helm-status-utils';

interface Props {
  release: HelmRelease;
}

export function HelmSummary({ release }: Props) {
  const isSuccess =
    release.info?.status === DeploymentStatus.DEPLOYED ||
    release.info?.status === DeploymentStatus.SUPERSEDED;

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <div>
          <Badge type={getStatusColor(release.info?.status)}>
            {getStatusText(release.info?.status)}
          </Badge>
        </div>
        {!!release.info?.description && !isSuccess && (
          <Alert color={getAlertColor(release.info?.status)}>
            {release.info?.description}
          </Alert>
        )}
        <div className="flex flex-wrap gap-2">
          {!!release.namespace && <Badge>Namespace: {release.namespace}</Badge>}
          {!!release.version && <Badge>Revision: #{release.version}</Badge>}
          {!!release.chart?.metadata?.name && (
            <Badge>Chart: {release.chart.metadata.name}</Badge>
          )}
          {!!release.chart?.metadata?.appVersion && (
            <Badge>App version: {release.chart.metadata.appVersion}</Badge>
          )}
          {!!release.chart?.metadata?.version && (
            <Badge>
              Chart version: {release.chart.metadata.name}-
              {release.chart.metadata.version}
            </Badge>
          )}
          {!!release.info?.last_deployed && (
            <Badge>
              Last deployed:{' '}
              {localizeDate(new Date(release.info.last_deployed))}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function getAlertColor(status?: string) {
  switch (status?.toLowerCase()) {
    case DeploymentStatus.DEPLOYED:
      return 'success';
    case DeploymentStatus.FAILED:
      return 'error';
    case DeploymentStatus.PENDING:
    case DeploymentStatus.PENDINGUPGRADE:
    case DeploymentStatus.PENDINGROLLBACK:
    case DeploymentStatus.UNINSTALLING:
      return 'warn';
    case DeploymentStatus.SUPERSEDED:
    default:
      return 'info';
  }
}
