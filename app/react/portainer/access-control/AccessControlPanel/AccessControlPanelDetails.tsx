import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import _ from 'lodash';
import { Info } from 'lucide-react';

import { truncate } from '@/portainer/filters/filters';
import { UserId } from '@/portainer/users/types';
import { TeamId } from '@/react/portainer/users/teams/types';
import { useTeams } from '@/react/portainer/users/teams/queries';
import { useUsers } from '@/portainer/users/queries';
import { pluralize } from '@/portainer/helpers/strings';
import { ownershipIcon } from '@/react/docker/components/datatable/createOwnershipColumn';

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
  resourceType?: ResourceControlType;
  isAuthorisedToFetchUsers?: boolean;
  resourceName?: string;
}

export function AccessControlPanelDetails({
  resourceControl,
  resourceType,
  isAuthorisedToFetchUsers = false,
  resourceName = 'resource',
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

  const ownershipTranslation: Record<string, string> = {
    [ResourceControlOwnership.PUBLIC]: '公开',
    [ResourceControlOwnership.PRIVATE]: '私有',
    [ResourceControlOwnership.RESTRICTED]: '受限',
    [ResourceControlOwnership.ADMINISTRATORS]: '管理员',
  };

  const users = useAuthorizedUsers(
    restrictedToUsers.map((ra) => ra.UserId),
    isAuthorisedToFetchUsers
  );
  const teams = useAuthorizedTeams(restrictedToTeams.map((ra) => ra.TeamId));

  const teamsLength = teams.data ? teams.data.length : 0;
  const unauthoisedTeams = restrictedToTeams.length - teamsLength;

  let teamsMessage = teams.data && teams.data.join(', ');
  if (unauthoisedTeams > 0 && teams.isFetched) {
    teamsMessage += teamsLength > 0 ? ' 和' : '';
    teamsMessage += ` ${unauthoisedTeams} 个您不属于的团队`;
  }

  const userMessage = users.data
    ? users.data.join(', ')
    : `${restrictedToUsers.length} 个用户`;

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
            <span aria-label="ownership">{ownershipTranslation[ownership] || ownership}</span>
            <Tooltip message={getOwnershipTooltip(ownership, resourceName)} />
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

function getOwnershipTooltip(
  ownership: ResourceControlOwnership,
  resourceName: string
) {
  switch (ownership) {
    case ResourceControlOwnership.PRIVATE:
      return `对该 ${resourceName} 的管理权限仅限于单个用户。`;
    case ResourceControlOwnership.RESTRICTED:
      return `该 ${resourceName} 只能由一组受限的用户和/或团队管理。`;
    case ResourceControlOwnership.PUBLIC:
      return `该 ${resourceName} 可由具有此环境访问权限的任何用户管理。`;
    case ResourceControlOwnership.ADMINISTRATORS:
    default:
      return `该 ${resourceName} 只能由管理员管理。`;
  }
}

function getInheritanceMessage(
  resourceType: ResourceControlType | undefined,
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
      <InheritanceMessage tooltip="应用在服务上的访问控制也适用于该服务的每个容器。">
        此资源的访问控制继承自以下服务：
        <Link
          to="docker.services.service"
          params={{ id: resourceId }}
          data-cy="docker-access-inherited-service"
          title={String(resourceId)}
        >
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
      <InheritanceMessage tooltip="应用在使用模板创建的容器上的访问控制也适用于与该容器相关联的每个卷。">
        此资源的访问控制继承自以下容器：
        <Link
          to="docker.containers.container"
          params={{ id: resourceId }}
          data-cy="docker-access-inherited-container"
          title={String(resourceId)}
        >
          {truncate(resourceId)}
        </Link>
      </InheritanceMessage>
    );
  }

  if (parentType === ResourceControlType.Stack) {
    return (
      <InheritanceMessage tooltip="应用在堆栈上的访问控制也适用于堆栈中的每个资源。">
        <span className="space-right">
          此资源的访问控制继承自以下堆栈：
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
        <div className="inline-flex items-center gap-1">
          <Icon icon={Info} mode="primary" />
          {children}
        </div>
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
