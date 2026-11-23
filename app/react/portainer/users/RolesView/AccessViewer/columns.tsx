import { createColumnHelper, CellContext } from '@tanstack/react-table';
import { Users } from 'lucide-react';

import { useCurrentUser } from '@/react/hooks/useUser';

import { Icon } from '@@/Icon';
import { Link } from '@@/Link';

import { AccessLocation, AccessViewerPolicyModel } from './model';

const ACCESS_LOCATION_LABELS: Record<AccessLocation, string> = {
  [AccessLocation.Environment]: '环境',
  [AccessLocation.EnvironmentGroup]: '环境分组',
};

const helper = createColumnHelper<AccessViewerPolicyModel>();

export const columns = [
  helper.accessor('endpointName', {
    header: '环境',
    id: 'Environment',
  }),
  helper.accessor('roleName', {
    header: '角色',
    id: 'Role',
  }),
  helper.display({
    header: '权限来源',
    cell: AccessCell,
  }),
];

const manageAccessLabel = (
  <span className="inline-flex items-center gap-1">
    <Icon icon={Users} />
    管理权限
  </span>
);

function AccessCell({
  row: { original: item },
}: CellContext<AccessViewerPolicyModel, unknown>) {
  const { isPureAdmin } = useCurrentUser();

  if (item.roleId === 0) {
    return (
      <>
        用户拥有所有环境的访问权限
        <div>
          <Link
            to="portainer.settings.edgeCompute"
            data-cy={`manage-access-button-${item.roleName}`}
          >
            {manageAccessLabel}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {prefix(item.teamName)} 权限定义在{' '}
      {ACCESS_LOCATION_LABELS[item.accessLocation]}{' '}
      {!!item.groupName && <code>{item.groupName}</code>}
      <div>{manageAccess(item, isPureAdmin)}</div>
    </>
  );
}

function prefix(teamName: string | undefined) {
  if (!teamName) {
    return '用户';
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

  if (item.groupName) {
    return (
      <Link
        to="portainer.groups.group"
        params={{ id: item.groupId, tab: 'access' }}
        data-cy={`manage-access-button-${item.roleName}`}
      >
        {manageAccessLabel}
      </Link>
    );
  }

  return (
    <Link
      to="portainer.endpoints.endpoint.access"
      params={{ id: item.endpointId }}
      data-cy={`manage-access-button-${item.roleName}`}
    >
      {manageAccessLabel}
    </Link>
  );
}
