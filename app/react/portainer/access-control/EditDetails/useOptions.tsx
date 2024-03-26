import _ from 'lodash';
import { useEffect, useState } from 'react';

import { buildOption } from '@/portainer/components/BoxSelector';
import { ownershipIcon } from '@/portainer/filters/filters';
import { Team } from '@/react/portainer/users/teams/types';

import { BoxSelectorOption } from '@@/BoxSelector/types';
import { BadgeIcon } from '@@/BadgeIcon';

import { ResourceControlOwnership } from '../types';

const publicOption: BoxSelectorOption<ResourceControlOwnership> = {
  value: ResourceControlOwnership.PUBLIC,
  label: '公开',
  id: 'access_public',
  description:
    '我希望任何有权限访问此环境的用户都能够管理此资源',
  icon: <BadgeIcon icon={ownershipIcon('public')} />,
};

export function useOptions(
  isAdmin: boolean,
  teams?: Team[],
  isPublicVisible = false
) {
  const [options, setOptions] = useState<
    Array<BoxSelectorOption<ResourceControlOwnership>>
  >([]);

  useEffect(() => {
    const options = isAdmin ? adminOptions() : nonAdminOptions(teams);

    setOptions(isPublicVisible ? [...options, publicOption] : options);
  }, [isAdmin, teams, isPublicVisible]);

  return options;
}

function adminOptions() {
  return [
    buildOption(
      'access_administrators',
      <BadgeIcon icon={ownershipIcon('administrators')} />,
      '管理员',
      '我希望将此资源的管理权限限制在管理员之内',
      ResourceControlOwnership.ADMINISTRATORS
    ),
    buildOption(
      'access_restricted',
      <BadgeIcon icon={ownershipIcon('restricted')} />,
      '受限',
      '我希望将此资源的管理权限限制在一组用户和/或团队之内',
      ResourceControlOwnership.RESTRICTED
    ),
  ];
}
function nonAdminOptions(teams?: Team[]) {
  return _.compact([
    buildOption(
      'access_private',
      <BadgeIcon icon={ownershipIcon('private')} />,
      '私有',
      '我希望将此资源的管理权限限制在我自己之内',
      ResourceControlOwnership.PRIVATE
    ),
    teams &&
      teams.length > 0 &&
      buildOption(
        'access_restricted',
        <BadgeIcon icon={ownershipIcon('restricted')} />,
        '受限',
        teams.length === 1 ? (
          <>
            我希望我的团队(<b>{teams[0].Name}</b>)的任何成员都能够管理此资源
          </>
        ) : (
          <>
            我希望将此资源的管理权限限制在一个或多个团队之内
          </>
        ),
        ResourceControlOwnership.RESTRICTED
      ),
  ]);
}
