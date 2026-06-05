import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RegistryId } from '@/react/portainer/registries/types/registry';
import { Webhook } from '@/react/portainer/webhooks/types';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { queryKeys } from './query-keys';

export function useUpdateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.base(),
      });
    },
    ...withGlobalError('Failed to update webhook'),
  });
}

async function updateWebhook({
  webhookId,
  registryId = 0,
}: {
  webhookId: Webhook['Id'];
  registryId?: RegistryId;
}) {
  try {
    const { data } = await axios.put<Webhook>(`/webhooks/${webhookId}`, {
      registryId,
    });
    return data;
  } catch (err) {
    throw parseAxiosError(err, 'Failed to update webhook');
  }
}
