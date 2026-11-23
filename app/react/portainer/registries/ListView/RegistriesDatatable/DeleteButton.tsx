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
          notifySuccess('成功', '镜像仓库已删除');
        },
      }
    );
  }
}

function getMessage(selectedCount: number) {
  return selectedCount > 1
    ? '这些镜像仓库可能正在被一个或多个环境中的应用程序使用。删除这些镜像仓库可能会导致使用它们的应用程序服务中断。您确定要删除所选的镜像仓库吗？'
    : '该镜像仓库可能正在被一个或多个环境中的应用程序使用。删除此镜像仓库可能会导致使用它的应用程序服务中断。您确定要删除所选的镜像仓库吗？';
}
