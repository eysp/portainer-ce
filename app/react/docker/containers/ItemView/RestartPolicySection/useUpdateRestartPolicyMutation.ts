import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { withGlobalError } from '@/react-tools/react-query';

import { updateContainer } from '../../queries/useUpdateContainer';
import { queryKeys } from '../../queries/query-keys';
import { RestartPolicy } from '../../CreateView/RestartPolicyTab/types';

interface UpdateRestartPolicyRequest {
  environmentId: EnvironmentId;
  containerId: string;
  policy: {
    name: RestartPolicy;
    maximumRetryCount?: number;
  };
  nodeName?: string;
}

export function useUpdateRestartPolicyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...withGlobalError('无法更新重启策略'),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.container(
          variables.environmentId,
          variables.containerId
        ),
      });
    },
    mutationFn: async ({
      environmentId,
      containerId,
      policy,
      nodeName,
    }: UpdateRestartPolicyRequest) => {
      await updateContainer(
        environmentId,
        containerId,
        {
          RestartPolicy: {
            Name: policy.name,
            MaximumRetryCount:
              policy.name === RestartPolicy.OnFailure
                ? policy.maximumRetryCount
                : undefined,
          },
        },
        { nodeName }
      );
    },
  });
}
