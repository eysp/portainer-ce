import { Heart, Power } from 'lucide-react';

import { Icon } from '@/react/components/Icon';

interface Props {
  stats: {
    running: number;
    stopped: number;
    healthy: number;
    unhealthy: number;
  };
}

export function ContainerStatus({ stats }: Props) {
  return (
    <div className="pull-right">
      <div>
        <div className="vertical-center space-right pr-5">
          <Icon icon={Power} mode="success" size="sm" />
          {stats.running} 运行中
        </div>
        <div className="vertical-center space-right">
          <Icon icon={Power} mode="danger" size="sm" />
          {stats.stopped} 已停止
        </div>
      </div>
      <div>
        <div className="vertical-center space-right pr-5">
          <Icon icon={Heart} mode="success" size="sm" />
          {stats.healthy} 健康
        </div>
        <div className="vertical-center space-right">
          <Icon icon={Heart} mode="danger" size="sm" />
          {stats.unhealthy} 不健康
        </div>
      </div>
    </div>
  );
}
