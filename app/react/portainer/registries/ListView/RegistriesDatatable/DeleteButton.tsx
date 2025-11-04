import { pluralize } from '@/portainer/helpers/strings';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton as BaseDeleteButton } from '@@/buttons/DeleteButton';

import { Registry } from '../../types/registry';

import { useDeleteRegistriesMutation } from './useDeleteRegistriesMutation';

export function DeleteButton({ selectedItems }: { selectedItems: Registry[] }) {
  const mutation = useDeleteRegistriesMutation();

  const confirmMessage = getMessage(selectedItems.length);

  return (
    <BaseDeleteButton
      data-cy="registry-removeRegistryButton"
      disabled={selectedItems.length === 0}
      confirmMessage={confirmMessage}
      onConfirmed={handleDelete}
    />
  );

  function handleDelete() {
    mutation.mutate(
      selectedItems.map((item) => item.Id),
      {
        onSuccess() {
          notifySuccess('成功', '注册表已移除');
        },
      }
    );
  }
}

function getMessage(selectedCount: number) {
  const registriesMsg = selectedCount > 1 ? '注册表' : '注册表';
  return `这些${registriesMsg}可能被一个或多个环境中的应用程序使用。移除${registriesMsg}可能会导致使用这些${registriesMsg}的应用程序服务中断。您要移除选定的${registriesMsg}吗？`;
}
