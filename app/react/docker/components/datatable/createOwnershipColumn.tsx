import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Eye, EyeOff, Users } from 'lucide-react';

import { ResourceControlOwnership } from '@/react/portainer/access-control/types';

import { Icon } from '@@/Icon';

export interface IResource {
  ResourceControl?: {
    Ownership: ResourceControlOwnership;
  };
}

export function createOwnershipColumn<D extends IResource>(
  enableHiding = true
): ColumnDef<D, ResourceControlOwnership> {
  return {
    accessorFn: (row) =>
      row.ResourceControl?.Ownership || ResourceControlOwnership.ADMINISTRATORS,
    header: '所有权',
    id: 'ownership',
    cell: OwnershipCell,
    enableHiding,
  };

  function OwnershipCell({
    getValue,
  }: CellContext<D, ResourceControlOwnership>) {
    const value = getValue();

    const translation: Record<ResourceControlOwnership, string> = {
      [ResourceControlOwnership.PUBLIC]: '公开',
      [ResourceControlOwnership.PRIVATE]: '私有',
      [ResourceControlOwnership.RESTRICTED]: '受限',
      [ResourceControlOwnership.ADMINISTRATORS]: '管理员',
    };

    return (
      <span className="flex items-center gap-2">
        <Icon icon={ownershipIcon(value)} className="space-right" />
        {translation[value] || value}
      </span>
    );
  }
}

export function ownershipIcon(ownership: ResourceControlOwnership) {
  switch (ownership) {
    case ResourceControlOwnership.PRIVATE:
      return EyeOff;
    case ResourceControlOwnership.ADMINISTRATORS:
      return EyeOff;
    case ResourceControlOwnership.RESTRICTED:
      return Users;
    default:
      return Eye;
  }
}
