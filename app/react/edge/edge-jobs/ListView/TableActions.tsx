import { notifySuccess } from '@/portainer/services/notifications';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { EdgeJob } from '../types';

import { useDeleteEdgeJobsMutation } from './useDeleteEdgeJobsMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: Array<EdgeJob>;
}) {
  const removeMutation = useDeleteEdgeJobsMutation();

  return (
    <div className="flex items-center gap-2">
      <DeleteButton
        confirmMessage="您要删除选中的边缘作业吗？"
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemove(selectedItems)}
        data-cy="remove-edge-jobs-button"
      />

      <AddButton data-cy="add-edge-job-button">添加边缘作业</AddButton>
    </div>
  );

  async function handleRemove(selectedItems: Array<EdgeJob>) {
    const ids = selectedItems.map((item) => item.Id);
    removeMutation.mutate(ids, {
      onSuccess: () => {
        notifySuccess('成功', '边缘作业已删除');
      },
    });
  }
}
