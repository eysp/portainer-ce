import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { promiseSequence } from '@/portainer/helpers/promise-utils';
import { withGlobalError, withInvalidate } from '@/react-tools/react-query';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';
import { pluralize } from '@/portainer/helpers/strings';

import { DeleteButton } from '@@/buttons/DeleteButton';

import { ConfigViewModel } from '../../model';
import { queryKeys } from '../../queries/query-keys';
import { deleteConfig } from '../../queries/useDeleteConfigMutation';

export function DeleteConfigButton({
  selectedItems,
}: {
  selectedItems: Array<ConfigViewModel>;
}) {
  const environmentId = useEnvironmentId();
  const mutation = useDeleteConfigListMutation(environmentId);

  return (
    <DeleteButton
      data-cy="remove-docker-configs-button"
      onConfirmed={() => {
        mutation.mutate(
          selectedItems.map((item) => item.Id),
          {
            onSuccess() {
              notifySuccess(
                `${pluralize(
                  selectedItems.length,
                  '配置'
                )} 已成功删除`,
                // log the item name if it's only one config
                selectedItems.length === 1 ? selectedItems[0].Name : ''
              );
            },
          }
        );
      }}
      confirmMessage="您要删除选中的配置吗？"
      disabled={selectedItems.length === 0}
    />
  );
}

function useDeleteConfigListMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: Array<string>) =>
      promiseSequence(
        ids.map((configId) => () => deleteConfig({ environmentId, configId }))
      ),
    ...withGlobalError('无法删除配置'),
    ...withInvalidate(queryClient, [queryKeys.base(environmentId)]),
  });
}
