import { localizeDate } from '@/react/common/date-utils';

import { BlocklistItem } from '@@/Blocklist/BlocklistItem';
import { Link } from '@@/Link';
import { Badge } from '@@/Badge';

import { HelmRelease } from '../types';
import { getStatusColor, getStatusText } from '../helm-status-utils';

export function HelmRevisionItem({
  item,
  currentRevision,
  namespace,
  name,
}: {
  item: HelmRelease;
  currentRevision?: number;
  namespace: string;
  name: string;
}) {
  return (
    <BlocklistItem
      data-cy="helm-history-item"
      isSelected={item.version === currentRevision}
      as={Link}
      to="kubernetes.helm"
      params={{ namespace, name, revision: item.version }}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-wrap gap-1 justify-between">
          <Badge type={getStatusColor(item.info?.status)}>
            {getStatusText(item.info?.status)}
          </Badge>
          <span className="text-xs text-muted">Revision #{item.version}</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-between">
          <span className="text-xs text-muted">
            {item.chart.metadata?.name}-{item.chart.metadata?.version}
          </span>
          {item.info?.last_deployed && (
            <span className="text-xs text-muted">
              {localizeDate(new Date(item.info.last_deployed))}
            </span>
          )}
        </div>
      </div>
    </BlocklistItem>
  );
}
