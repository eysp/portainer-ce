import { notifySuccess } from '@/portainer/services/notifications';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { EdgeGroup } from '../types';

import { useDeleteEdgeGroupsMutation } from './useDeleteEdgeGroupMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: Array<EdgeGroup>;
}) {
  const removeMutation = useDeleteEdgeGroupsMutation();

  return (
    <div className="flex items-center gap-2">
      <DeleteButton
        confirmMessage="您确定要移除选定的边缘分组吗？"
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemove(selectedItems)}
        data-cy="remove-edge-group-button"
      />

      <AddButton data-cy="add-edge-group-button">添加边缘分组</AddButton>
    </div>
  );

  async function handleRemove(selectedItems: Array<EdgeGroup>) {
    const ids = selectedItems.map((item) => item.Id);
    removeMutation.mutate(ids, {
      onSuccess: () => {
        notifySuccess('成功', '边缘分组已移除');
      },
    });
  }
}
