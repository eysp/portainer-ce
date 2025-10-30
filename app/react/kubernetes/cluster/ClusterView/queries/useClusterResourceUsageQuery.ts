import { useQuery } from '@tanstack/react-query';
import { Node } from 'kubernetes-types/core/v1';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { getMetricsForAllNodes } from '@/react/kubernetes/metrics/metrics';
import KubernetesResourceReservationHelper from '@/kubernetes/helpers/resourceReservationHelper';
import { withGlobalError } from '@/react-tools/react-query';
import { NodeMetrics } from '@/react/kubernetes/metrics/types';

export function useClusterResourceUsageQuery(
  environmentId: EnvironmentId,
  serverMetricsEnabled: boolean,
  authorized: boolean,
  nodes: Node[]
) {
  return useQuery(
    [environmentId, 'clusterResourceUsage'],
    () => getMetricsForAllNodes(environmentId),
    {
      enabled:
        authorized &&
        serverMetricsEnabled &&
        !!environmentId &&
        nodes.length > 0,
      select: aggregateResourceUsage,
      ...withGlobalError('Unable to retrieve resource usage data.', 'Failure'),
    }
  );
}

function aggregateResourceUsage(data: NodeMetrics) {
  return data.items.reduce(
    (total, item) => ({
      cpu:
        total.cpu +
        KubernetesResourceReservationHelper.parseCPU(item.usage.cpu),
      memory:
        total.memory +
        KubernetesResourceReservationHelper.megaBytesValue(item.usage.memory),
    }),
    {
      cpu: 0,
      memory: 0,
    }
  );
}
