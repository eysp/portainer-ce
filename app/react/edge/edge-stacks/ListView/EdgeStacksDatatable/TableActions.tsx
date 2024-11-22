import { Trash2, Plus } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';

import { Button } from '@@/buttons';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';
import { Link } from '@@/Link';

import { useDeleteEdgeStacksMutation } from './useDeleteEdgeStacksMutation';
import { DecoratedEdgeStack } from './types';

export function TableActions({
  selectedItems,
}: {
  selectedItems: Array<DecoratedEdgeStack>;
}) {
  const removeMutation = useDeleteEdgeStacksMutation();

  return (
    <div className="flex items-center gap-2">
      <Button
        color="dangerlight"
        disabled={selectedItems.length === 0}
        onClick={() => handleRemove(selectedItems)}
        icon={Trash2}
        className="!m-0"
      >
        删除
      </Button>

      <Button
        as={Link}
        props={{ to: 'edge.stacks.new' }}
        icon={Plus}
        className="!m-0"
        data-cy="edgeStack-addStackButton"
      >
        添加堆栈
      </Button>
    </div>
  );

  async function handleRemove(selectedItems: Array<DecoratedEdgeStack>) {
    const confirmed = await confirmDestructive({
      title: '您确定吗？',
      message: '您确定要删除除选定的 Edge 堆栈吗？',
      confirmButton: buildConfirmButton('删除', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    const ids = selectedItems.map((item) => item.Id);
    removeMutation.mutate(ids, {
      onSuccess: () => {
        notifySuccess('成功', 'Edge 堆栈已移除');
      },
    });
  }
}
