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
          notifySuccess('成功', '已删除镜像仓库');
        },
      }
    );
  }
}

function getMessage(selectedCount: number) {
  const regAttrMsg = selectedCount > 1 ? '这些' : '这个';
  const registriesMsg = selectedCount > 1 ? '镜像仓库' : '镜像仓库';
  return `${regAttrMsg} ${registriesMsg} 可能被一个或多个环境中的应用程序使用。删除${regAttrMsg} ${registriesMsg} 可能会导致使用${regAttrMsg} ${registriesMsg} 的应用程序服务中断。您确定要删除选中的 ${registriesMsg} 吗？`;
}
