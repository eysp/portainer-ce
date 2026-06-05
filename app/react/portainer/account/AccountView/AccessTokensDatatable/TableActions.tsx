import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton } from '@@/buttons/DeleteButton';
import { AddButton } from '@@/buttons';

import { AccessToken } from '../../access-tokens/types';

import { useDeleteAccessTokensMutation } from './useDeleteAccessTokensMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: AccessToken[];
}) {
  const deleteMutation = useDeleteAccessTokensMutation();

  return (
    <>
      <DeleteButton
        disabled={selectedItems.length === 0}
        confirmMessage="您要删除选中的访问令牌吗？使用这些令牌的任何脚本或应用程序将无法再调用 Portainer API。"
        onConfirmed={handleRemove}
        data-cy="access-tokens-delete-button"
      />

      <AddButton to=".new-access-token" data-cy="access-tokens-add-button">
        添加访问令牌
      </AddButton>
    </>
  );

  function handleRemove() {
    const ids = selectedItems.map((item) => item.id);
    deleteMutation.mutate(ids, {
      onSuccess() {
        notifySuccess('成功', '访问令牌已删除');
      },
    });
  }
}
