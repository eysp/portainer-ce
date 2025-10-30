import { useQuery } from '@tanstack/react-query';
import { Node } from 'kubernetes-types/core/v1';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { getTotalResourcesForAllApplications } from '@/react/kubernetes/metrics/metrics';
import KubernetesResourceReservationHelper from '@/kubernetes/helpers/resourceReservationHelper';

export function useClusterResourceReservationQuery(
  environmentId: EnvironmentId,
  nodes: Node[]
) {
  return useQuery(
    [environmentId, 'clusterResourceReservation'],
    () => getTotalResourcesForAllApplications(environmentId),
    {
      enabled: !!environmentId && nodes.length > 0,
      select: (data) => ({
        cpu: data.CpuRequest,
        memory: KubernetesResourceReservationHelper.megaBytesValue(
          data.MemoryRequest
        ),
      }),
    }
  );
}
