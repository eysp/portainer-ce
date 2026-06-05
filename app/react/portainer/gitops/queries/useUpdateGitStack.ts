import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { GitStackPayload } from '@/react/common/stacks/types';
import { buildStackUrl } from '@/react/common/stacks/queries/buildUrl';
import { queryKeys } from '@/react/common/stacks/queries/query-keys';

async function updateGitStack(
  stackId: number,
  endpointId: number,
  payload: GitStackPayload
) {
  try {
    const { data } = await axios.put(
      buildStackUrl(stackId, 'git/redeploy'),
      payload,
      { params: { endpointId } }
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error);
  }
}

export function useUpdateGitStack(stackId: number, endpointId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['git-stack', 'redeploy', endpointId, stackId],
    mutationFn: (payload: GitStackPayload) =>
      updateGitStack(stackId, endpointId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stack(stackId),
        exact: true,
      });
    },
  });
}
