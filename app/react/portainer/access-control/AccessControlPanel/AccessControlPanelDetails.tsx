import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import _ from 'lodash';

import { ownershipIcon, truncate } from '@/portainer/filters/filters';
import { UserId } from '@/portainer/users/types';
import { TeamId } from '@/react/portainer/users/teams/types';
import { useTeams } from '@/react/portainer/users/teams/queries';
import { useUsers } from '@/portainer/users/queries';

import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';

import {
  ResourceControlOwnership,
  ResourceControlType,
  ResourceId,
} from '../types';
import { ResourceControlViewModel } from '../models/ResourceControlViewModel';

interface Props {
  resourceControl?: ResourceControlViewModel;
  resourceType: ResourceControlType;
}

export function AccessControlPanelDetails({
  resourceControl,
  resourceType,
}: Props) {
  const inheritanceMessage = getInheritanceMessage(
    resourceType,
    resourceControl
  );

  const {
    Ownership: ownership = ResourceControlOwnership.ADMINISTRATORS,
    UserAccesses: restrictedToUsers = [],
    TeamAccesses: restrictedToTeams = [],
  } = resourceControl || {};

  const users = useAuthorizedUsers(restrictedToUsers.map((ra) => ra.UserId));
  const teams = useAuthorizedTeams(restrictedToTeams.map((ra) => ra.TeamId));

  return (
    <table className="table">
      <tbody>
        <tr data-cy="access-ownership">
          <td>所有权</td>
          <td>
            <i
              className={clsx(ownershipIcon(ownership), 'space-right')}
              aria-hidden="true"
              aria-label="ownership-icon"
            />
            <span aria-label="ownership">{ownership}</span>
            <Tooltip message={getOwnershipTooltip(ownership)} />
          </td>
        </tr>
        {inheritanceMessage}
        {restrictedToUsers.length > 0 && (
          <tr data-cy="access-authorisedUsers">
            <td>授权用户</td>
            <td aria-label="authorized-users">
              {users.data && users.data.join(', ')}
            </td>
          </tr>
        )}
        {restrictedToTeams.length > 0 && (
          <tr data-cy="access-authorisedTeams">
            <td>授权团队</td>
            <td aria-label="authorized-teams">
              {teams.data && teams.data.join(', ')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function getOwnershipTooltip(ownership: ResourceControlOwnership) {
  switch (ownership) {
    case ResourceControlOwnership.PRIVATE:
      return '该资源的管理只限于一个用户。';
    case ResourceControlOwnership.RESTRICTED:
      return '该资源可由一组受限制的用户和/或团队管理。';
    case ResourceControlOwnership.PUBLIC:
      return '这个资源可以由任何有权限进入这个环境的用户管理。';
    case ResourceControlOwnership.ADMINISTRATORS:
    default:
      return '该资源只能由管理员管理。';
  }
}

function getInheritanceMessage(
  resourceType: ResourceControlType,
  resourceControl?: ResourceControlViewModel
) {
  if (!resourceControl || resourceControl.Type === resourceType) {
    return null;
  }

  const parentType = resourceControl.Type;
  const resourceId = resourceControl.ResourceId;

  if (
    resourceType === ResourceControlType.Container &&
    parentType === ResourceControlType.Service
  ) {
    return (
      <InheritanceMessage tooltip="应用于一个服务的访问控制也应用于该服务的每个容器。">
        该资源的访问控制继承自以下服务。
        <Link to="docker.services.service" params={{ id: resourceId }}>
          {truncate(resourceId)}
        </Link>
      </InheritanceMessage>
    );
  }

  if (
    resourceType === ResourceControlType.Volume &&
    parentType === ResourceControlType.Container
  ) {
    return (
      <InheritanceMessage tooltip="在使用模板创建的容器上应用的访问控制也适用于与该容器相关的每个卷。">
        该资源的访问控制继承自以下内容
        容器：
        <Link to="docker.containers.container" params={{ id: resourceId }}>
          {truncate(resourceId)}
        </Link>
      </InheritanceMessage>
    );
  }

  if (parentType === ResourceControlType.Stack) {
    return (
      <InheritanceMessage tooltip="应用于堆栈的访问控制也应用于堆栈中的每个资源。">
        <span className="space-right">
        该资源的访问控制继承自以下堆栈：
        </span>
        {removeEndpointIdFromStackResourceId(resourceId)}
      </InheritanceMessage>
    );
  }

  return null;
}

function removeEndpointIdFromStackResourceId(stackName: ResourceId) {
  if (!stackName || typeof stackName !== 'string') {
    return stackName;
  }

  const firstUnderlineIndex = stackName.indexOf('_');
  if (firstUnderlineIndex < 0) {
    return stackName;
  }
  return stackName.substring(firstUnderlineIndex + 1);
}

interface InheritanceMessageProps {
  tooltip: string;
}

function InheritanceMessage({
  children,
  tooltip,
}: PropsWithChildren<InheritanceMessageProps>) {
  return (
    <tr>
      <td colSpan={2} aria-label="inheritance-message">
        <i className="fa fa-info-circle space-right" aria-hidden="true" />
        {children}
        <Tooltip message={tooltip} />
      </td>
    </tr>
  );
}

function useAuthorizedTeams(authorizedTeamIds: TeamId[]) {
  return useTeams(false, 0, {
    enabled: authorizedTeamIds.length > 0,
    select: (teams) => {
      if (authorizedTeamIds.length === 0) {
        return [];
      }

      return _.compact(
        authorizedTeamIds.map((id) => {
          const team = teams.find((u) => u.Id === id);
          return team?.Name;
        })
      );
    },
  });
}

function useAuthorizedUsers(authorizedUserIds: UserId[]) {
  return useUsers(false, 0, authorizedUserIds.length > 0, (users) => {
    if (authorizedUserIds.length === 0) {
      return [];
    }

    return _.compact(
      authorizedUserIds.map((id) => {
        const user = users.find((u) => u.Id === id);
        return user?.Username;
      })
    );
  });
}
