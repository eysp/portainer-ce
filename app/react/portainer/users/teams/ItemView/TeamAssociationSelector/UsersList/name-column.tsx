import { PlusCircle } from 'lucide-react';
import { CellContext, ColumnDef } from '@tanstack/react-table';

import { User } from '@/portainer/users/types';
import { notifySuccess } from '@/portainer/services/notifications';
import { useAddMemberMutation } from '@/react/portainer/users/teams/queries';

import { Button } from '@@/buttons';

import { useRowContext } from './RowContext';

export const name: ColumnDef<User, string> = {
  header: '名称',
  accessorFn: (row) => row.Username,
  id: 'name',
  cell: NameCell,
};

export function NameCell({
  getValue,
  row: { original: user },
}: CellContext<User, string>) {
  const name = getValue();
  const { disabled, teamId } = useRowContext();

  const addMemberMutation = useAddMemberMutation(teamId);

  return (
    <>
      {name}

      <Button
        color="link"
        className="space-left nopadding"
        disabled={disabled}
        icon={PlusCircle}
        onClick={() => handleAddMember()}
      >
        添加
      </Button>
    </>
  );

  function handleAddMember() {
    addMemberMutation.mutate([user.Id], {
      onSuccess() {
        notifySuccess('用户已添加到团队', name);
      },
    });
  }
}
