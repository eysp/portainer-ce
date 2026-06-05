import { useMutation, useQueryClient } from '@tanstack/react-query';

import { withGlobalError } from '@/react-tools/react-query';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys as containerQueryKeys } from '../../../queries/query-keys';
import { recreateContainer } from '../../../containers.service';
import { ContainerId } from '../../../types';

interface RecreateContainerParams {
  environmentId: EnvironmentId;
  containerId: ContainerId;
  pullImage: boolean;
  nodeName?: string;
}

export function useRecreateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      environmentId,
      containerId,
      pullImage,
      nodeName,
    }: RecreateContainerParams) =>
      recreateContainer(environmentId, containerId, pullImage, { nodeName }),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: containerQueryKeys.container(
          variables.environmentId,
          variables.containerId
        ),
      });
    },
    ...withGlobalError('无法重新创建容器'),
  });
}
