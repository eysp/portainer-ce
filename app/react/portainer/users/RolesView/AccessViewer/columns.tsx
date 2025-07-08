import { createColumnHelper, CellContext } from '@tanstack/react-table';
import { Users } from 'lucide-react';

import { useCurrentUser } from '@/react/hooks/useUser';

import { Icon } from '@@/Icon';
import { Link } from '@@/Link';

import { AccessViewerPolicyModel } from './model';

const helper = createColumnHelper<AccessViewerPolicyModel>();

export const columns = [
  helper.accessor('EndpointName', {
    header: '环境',
    id: 'Environment',
  }),
  helper.accessor('RoleName', {
    header: '角色',
    id: 'Role',
  }),
  helper.display({
    header: '访问来源',
    cell: AccessCell,
  }),
];

function AccessCell({
  row: { original: item },
}: CellContext<AccessViewerPolicyModel, unknown>) {
  const { isPureAdmin } = useCurrentUser();

  if (item.RoleId === 0) {
    return (
      <>
        用户可访问所有环境
        <Link
          to="portainer.settings.edgeCompute"
          data-cy={`manage-access-button-${item.RoleName}`}
        >
          <Icon icon={Users} /> 管理访问
        </Link>
      </>
    );
  }

  return (
    <>
      {prefix(item.TeamName)} 的访问权限定义在 {item.AccessLocation}{' '}
      {!!item.GroupName && <code>{item.GroupName}</code>}{' '}
      {manageAccess(item, isPureAdmin)}
    </>
  );
}

function prefix(teamName: string | undefined) {
  if (!teamName) {
    return 'User';
  }
  return (
    <>
      团队 <code>{teamName}</code>
    </>
  );
}

function manageAccess(item: AccessViewerPolicyModel, isPureAdmin: boolean) {
  if (!isPureAdmin) {
    return null;
  }

  return item.GroupName ? (
    <Link
      to="portainer.groups.group.access"
      params={{ id: item.GroupId }}
      data-cy={`manage-access-button-${item.RoleName}`}
    >
      <Icon icon={Users} /> 管理访问
    </Link>
  ) : (
    <Link
      to="portainer.endpoints.endpoint.access"
      params={{ id: item.EndpointId }}
      data-cy={`manage-access-button-${item.RoleName}`}
    >
      <Icon icon={Users} /> 管理访问
    </Link>
  );
}
