import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton } from '@@/buttons/DeleteButton';
import { AddButton } from '@@/buttons';

import { EnvironmentGroup } from '../../types';

import { useDeleteEnvironmentGroupsMutation } from './useDeleteEnvironmentGroupsMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: EnvironmentGroup[];
}) {
  const deleteMutation = useDeleteEnvironmentGroupsMutation();

  return (
    <>
      <DeleteButton
        disabled={selectedItems.length === 0}
        confirmMessage="您确定要移除选定的环境分组吗？"
        onConfirmed={handleRemove}
        data-cy="remove-environment-groups-button"
      />

      <AddButton data-cy="add-environment-group-button">添加分组</AddButton>
    </>
  );

  function handleRemove() {
    const ids = selectedItems.map((item) => item.Id);
    deleteMutation.mutate(ids, {
      onSuccess() {
        notifySuccess('成功', '环境分组已移除');
      },
    });
  }
}
