import { DeleteButton } from '@@/buttons/DeleteButton';

import { Access } from './types';

export function RemoveAccessButton({
  onClick,
  items,
}: {
  onClick(items: Array<Access>): void;
  items: Array<Access>;
}) {
  return (
    <DeleteButton
      confirmMessage="您确定要取消选中用户或团队的授权吗？"
      onConfirmed={() => onClick(items)}
      disabled={items.length === 0}
      data-cy="remove-access-button"
    />
  );
}
