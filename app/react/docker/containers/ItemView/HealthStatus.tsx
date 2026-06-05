import { ComponentProps } from 'react';
import { HeartPulse, Server } from 'lucide-react';
import { Health } from 'docker-types/generated/1.44';

import { TableContainer, TableTitle } from '@@/datatables';
import { DetailsTable } from '@@/DetailsTable';
import { Icon } from '@@/Icon';

const StatusMode: Record<
  Exclude<Health['Status'], undefined | 'none'>,
  ComponentProps<typeof Icon>['mode']
> = {
  healthy: 'success',
  unhealthy: 'danger',
  starting: 'warning',
};

interface Props {
  health: Health;
}

export function HealthStatus({ health }: Props) {
  return (
    <TableContainer>
      <TableTitle label="容器健康状态" icon={Server} />

      <DetailsTable dataCy="health-status-table">
        <DetailsTable.Row label="状态">
          {health.Status && health.Status !== 'none' ? (
            <div className="vertical-center">
              <Icon
                icon={HeartPulse}
                mode={StatusMode[health.Status]}
                className="space-right"
              />
              {health.Status}
            </div>
          ) : (
            <div>无健康状态</div>
          )}
        </DetailsTable.Row>

        <DetailsTable.Row label="失败次数">
          <div className="vertical-center">{health.FailingStreak}</div>
        </DetailsTable.Row>

        {!!health.Log?.length && (
          <DetailsTable.Row label="最后输出">
            {health.Log[health.Log.length - 1].Output}
          </DetailsTable.Row>
        )}
      </DetailsTable>
    </TableContainer>
  );
}
