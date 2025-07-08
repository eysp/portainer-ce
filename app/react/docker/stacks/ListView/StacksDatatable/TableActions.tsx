import { Authorized } from '@/react/hooks/useUser';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { DecoratedStack } from './types';

export function TableActions({
  selectedItems,
  onRemove,
}: {
  selectedItems: Array<DecoratedStack>;
  onRemove: (items: Array<DecoratedStack>) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Authorized authorizations="PortainerStackDelete">
        <DeleteButton
          disabled={selectedItems.length === 0}
          onConfirmed={() => onRemove(selectedItems)}
          confirmMessage="您确定要删除选中的堆栈吗？相关的服务也将被删除。"
          data-cy="stack-removeStackButton"
        />
      </Authorized>

      <Authorized authorizations="PortainerStackCreate">
        <AddButton data-cy="stack-addStackButton" to=".newstack">
          添加堆栈
        </AddButton>
      </Authorized>
    </div>
  );
}
