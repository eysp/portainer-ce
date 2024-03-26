import {
  Box,
  Cpu,
  Database,
  HardDrive,
  Heart,
  Layers,
  List,
  Power,
  Shuffle,
} from 'lucide-react';

import Memory from '@/assets/ico/memory.svg?c';
import { addPlural } from '@/portainer/helpers/strings';
import { DockerSnapshot } from '@/react/docker/snapshots/types';
import { humanize } from '@/portainer/filters/filters';

import { StatsItem } from '@@/StatsItem';

interface Props {
  snapshot?: DockerSnapshot;
}

export function EnvironmentStatsDocker({ snapshot }: Props) {
  if (!snapshot) {
    return <>No snapshot available</>;
  }

  return (
    <>
      <StatsItem
        value={addPlural(snapshot.StackCount, '堆栈')}
        icon={Layers}
      />

      {!!snapshot.Swarm && (
        <StatsItem
          value={addPlural(snapshot.ServiceCount, '服务')}
          icon={Shuffle}
        />
      )}

      <ContainerStats
        running={snapshot.RunningContainerCount}
        stopped={snapshot.StoppedContainerCount}
        healthy={snapshot.HealthyContainerCount}
        unhealthy={snapshot.UnhealthyContainerCount}
      />
      <StatsItem
        value={addPlural(snapshot.VolumeCount, '存储卷')}
        icon={Database}
      />
      <StatsItem value={addPlural(snapshot.ImageCount, '镜像')} icon={List} />

      <StatsItem icon={Cpu} value={`${snapshot.TotalCPU} CPU`} />

      <StatsItem
        icon={Memory}
        value={`${humanize(snapshot.TotalMemory)} 内存`}
      />

      {snapshot.Swarm && (
        <StatsItem
          value={addPlural(snapshot.NodeCount, '节点')}
          icon={HardDrive}
        />
      )}
    </>
  );
}

interface ContainerStatsProps {
  running: number;
  stopped: number;
  healthy: number;
  unhealthy: number;
}

function ContainerStats({
  running,
  stopped,
  healthy,
  unhealthy,
}: ContainerStatsProps) {
  const containersCount = running + stopped;

  return (
    <StatsItem value={addPlural(containersCount, '容器')} icon={Box}>
      {containersCount > 0 && (
        <>
          <StatsItem value={running} icon={Power} iconClass="icon-success" />
          <StatsItem value={stopped} icon={Power} iconClass="icon-danger" />
          <StatsItem value={healthy} icon={Heart} iconClass="icon-success" />
          <StatsItem value={unhealthy} icon={Heart} iconClass="icon-warning" />
        </>
      )}
    </StatsItem>
  );
}
