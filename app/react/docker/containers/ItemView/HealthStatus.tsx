import { ComponentProps } from 'react';
import { HeartPulse, Server } from 'lucide-react';

import { TableContainer, TableTitle } from '@@/datatables';
import { DetailsTable } from '@@/DetailsTable';
import { Icon } from '@@/Icon';

import { Health } from '../types/response';

const StatusMode: Record<
  Health['Status'],
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
      <TableTitle label="容器健康" icon={Server} />

      <DetailsTable>
        <DetailsTable.Row label="状态">
          <div className="vertical-center">
            <Icon
              icon={HeartPulse}
              mode={StatusMode[health.Status]}
              className="space-right"
            />
            {health.Status}
          </div>
        </DetailsTable.Row>

        <DetailsTable.Row label="失败次数">
          <div className="vertical-center">{health.FailingStreak}</div>
        </DetailsTable.Row>

        <DetailsTable.Row label="最后输出">
          {health.Log[health.Log.length - 1].Output}
        </DetailsTable.Row>
      </DetailsTable>
    </TableContainer>
  );
}
