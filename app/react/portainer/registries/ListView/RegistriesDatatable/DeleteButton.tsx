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
  const regAttrMsg = selectedCount > 1 ? '些' : '个';
  const registriesMsg = pluralize(selectedCount, '镜像仓库', '镜像仓库');
  return `这${regAttrMsg}${registriesMsg}可能正被一个或多个环境中的应用程序使用。移除这${regAttrMsg}${registriesMsg}可能会导致使用这些镜像仓库的应用程序出现服务中断。你确定要移除所选的${registriesMsg}吗？`;
}
