import { Power } from 'lucide-react';

import { StatsItem } from '@@/StatsItem';

interface Props {
  running: number;
  stopped: number;
}

export function RunningStatus({ running, stopped }: Props) {
  return (
    <div>
      <div>
        <StatsItem
          value={`${running || '-'} 运行中`}
          icon={Power}
          iconClass="icon-success"
        />
        {`${running || '-'} 运行中`}
      </div>
      <div>
        <StatsItem
          value={`${stopped || '-'} 已停止`}
          icon={Power}
          iconClass="icon-danger"
        />
        {`${stopped || '-'} 已停止`}
      </div>
    </div>
  );
}
