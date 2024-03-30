import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import _ from 'lodash';
import { Info } from 'lucide-react';

import { ownershipIcon, truncate } from '@/portainer/filters/filters';
import { UserId } from '@/portainer/users/types';
import { TeamId } from '@/react/portainer/users/teams/types';
import { useTeams } from '@/react/portainer/users/teams/queries';
import { useUsers } from '@/portainer/users/queries';
import { pluralize } from '@/portainer/helpers/strings';

import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';
import { Icon } from '@@/Icon';

import {
  ResourceControlOwnership,
  ResourceControlType,
  ResourceId,
} from '../types';
import { ResourceControlViewModel } from '../models/ResourceControlViewModel';

interface Props {
  resourceControl?: ResourceControlViewModel;
  resourceType: ResourceControlType;
  isAuthorisedToFetchUsers?: boolean;
}

export function AccessControlPanelDetails({
  resourceControl,
  resourceType,
  isAuthorisedToFetchUsers = false,
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

  const users = useAuthorizedUsers(
    restrictedToUsers.map((ra) => ra.UserId),
    isAuthorisedToFetchUsers
  );
  const teams = useAuthorizedTeams(restrictedToTeams.map((ra) => ra.TeamId));

  const teamsLength = teams.data ? teams.data.length : 0;
  const unauthoisedTeams = restrictedToTeams.length - teamsLength;

  let teamsMessage = teams.data && teams.data.join(', ');
  if (unauthoisedTeams > 0 && teams.isFetched) {
    teamsMessage += teamsLength > 0 ? ' and' : '';
    teamsMessage += ` ${unauthoisedTeams} ${pluralize(
      unauthoisedTeams,
      'team'
    )} you are not part of`;
  }

  const userMessage = users.data
    ? users.data.join(', ')
    : `${restrictedToUsers.length} ${pluralize(
        restrictedToUsers.length,
        'user'
      )}`;

  return (
    <table className="table">
  <tbody>
    <tr data-cy="access-ownership">
      <td className="w-1/5">所有权</td>
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
        <td>已授权用户</td>
        <td aria-label="authorized-users">{userMessage}</td>
      </tr>
    )}
    {restrictedToTeams.length > 0 && (
      <tr data-cy="access-authorisedTeams">
        <td>已授权团队</td>
        <td aria-label="authorized-teams">{teamsMessage}</td>
      </tr>
    )}
  </tbody>
</table>
  );
}

function getOwnershipTooltip(ownership) {
  switch (ownership) {
    case ResourceControlOwnership.PRIVATE:
      return '此资源的管理仅限于单个用户。';
    case ResourceControlOwnership.RESTRICTED:
      return '此资源可以由一组受限制的用户和/或团队来管理。';
    case ResourceControlOwnership.PUBLIC:
      return '任何具有对此环境的访问权限的用户都可以管理此资源。';
    case ResourceControlOwnership.ADMINISTRATORS:
    default:
      return '只有管理员才能管理此资源。';
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
      <InheritanceMessage tooltip="对服务应用的访问控制也会应用于该服务中的每个容器。">
        此资源的访问控制从以下服务继承：
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
      <InheritanceMessage tooltip="对使用模板创建的容器应用的访问控制也会应用于与容器关联的每个存储卷。">
        此资源的访问控制从以下容器继承：
        <Link to="docker.containers.container" params={{ id: resourceId }}>
          {truncate(resourceId)}
        </Link>
      </InheritanceMessage>
    );
  }

  if (parentType === ResourceControlType.Stack) {
    return (
      <InheritanceMessage tooltip="对堆栈应用的访问控制也会应用于堆栈中的每个资源。">
        <span className="space-right">
          此资源的访问控制从以下堆栈继承：
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
        <Icon icon={Info} mode="primary" className="mr-1" />
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

function useAuthorizedUsers(authorizedUserIds: UserId[], enabled = true) {
  return useUsers(
    false,
    0,
    authorizedUserIds.length > 0 && enabled,
    (users) => {
      if (authorizedUserIds.length === 0) {
        return [];
      }

      return _.compact(
        authorizedUserIds.map((id) => {
          const user = users.find((u) => u.Id === id);
          return user?.Username;
        })
      );
    }
  );
}
