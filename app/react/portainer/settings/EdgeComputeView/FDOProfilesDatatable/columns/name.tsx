import { CellProps, Column } from 'react-table';
import { useSref } from '@uirouter/react';

import { Profile } from '@/portainer/hostmanagement/fdo/model';

export const name: Column<Profile> = {
  Header: '名称',
  accessor: 'name',
  id: 'name',
  Cell: NameCell,
  disableFilters: true,
  Filter: () => null,
  canHide: true,
  sortType: 'string',
};

export function NameCell({
  value: name,
  row: { original: profile },
}: CellProps<Profile>) {
  const linkProps = useSref('portainer.endpoints.profile.edit', {
    id: profile.id,
  });

  return (
    <a href={linkProps.href} onClick={linkProps.onClick} title={name}>
      {name}
    </a>
  );
}
