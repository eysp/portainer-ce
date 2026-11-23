import _ from 'lodash';
import { useEffect, useState } from 'react';

import { buildOption } from '@/portainer/components/BoxSelector';
import { Team } from '@/react/portainer/users/teams/types';
import { ownershipIcon } from '@/react/docker/components/datatable/createOwnershipColumn';

import { BoxSelectorOption } from '@@/BoxSelector/types';
import { BadgeIcon } from '@@/BadgeIcon';

import { ResourceControlOwnership } from '../types';

function publicOption(
  resourceName: string
): BoxSelectorOption<ResourceControlOwnership> {
  return {
    value: ResourceControlOwnership.PUBLIC,
    label: '公开',
    id: 'access_public',
    description: `我希望任何有权访问此 ${resourceName} 的用户都能管理此 ${resourceName}`,
    icon: <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.PUBLIC)} />,
  };
}

export function useOptions(
  isAdmin: boolean,
  teams?: Team[],
  isPublicVisible = false,
  resourceName = 'resource'
) {
  const [options, setOptions] = useState<
    Array<BoxSelectorOption<ResourceControlOwnership>>
  >([]);

  useEffect(() => {
    const options = isAdmin
      ? adminOptions(resourceName)
      : nonAdminOptions(teams, resourceName);

    setOptions(
      isPublicVisible ? [...options, publicOption(resourceName)] : options
    );
  }, [isAdmin, teams, isPublicVisible, resourceName]);

  return options;
}

function adminOptions(resourceName: string) {
  return [
    buildOption(
      'access_administrators',
      <BadgeIcon
        icon={ownershipIcon(ResourceControlOwnership.ADMINISTRATORS)}
      />,
      '管理员',
      `我希望将此 ${resourceName} 的管理权限限制为仅管理员`,
      ResourceControlOwnership.ADMINISTRATORS
    ),
    buildOption(
      'access_restricted',
      <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.RESTRICTED)} />,
      '受限',
      `我希望将此 ${resourceName} 的管理权限限制为一组用户和/或团队`,
      ResourceControlOwnership.RESTRICTED
    ),
  ];
}
function nonAdminOptions(teams?: Team[], resourceName = 'resource') {
  return _.compact([
    buildOption(
      'access_private',
      <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.PRIVATE)} />,
      '私有',
      `我希望将此 ${resourceName} 的管理权限限制为仅我自己`,
      ResourceControlOwnership.PRIVATE
    ),
    teams &&
      teams.length > 0 &&
      buildOption(
        'access_restricted',
        <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.RESTRICTED)} />,
        '受限',
        teams.length === 1 ? (
          <>
            我希望我的团队 (<b>{teams[0].Name}</b>) 的任何成员都能管理此 {resourceName}
          </>
        ) : (
          <>
            我希望将此 {resourceName} 的管理权限限制为我的一个或多个团队
          </>
        ),
        ResourceControlOwnership.RESTRICTED
      ),
  ]);
}
