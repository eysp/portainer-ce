import _ from 'lodash';
import { useEffect, useState } from 'react';

import { buildOption } from '@/portainer/components/BoxSelector';
import { ownershipIcon } from '@/portainer/filters/filters';
import { Team } from '@/react/portainer/users/teams/types';

import { BoxSelectorOption } from '@@/BoxSelector/types';
import { BadgeIcon } from '@@/BoxSelector/BadgeIcon';

import { ResourceControlOwnership } from '../types';

const publicOption: BoxSelectorOption<ResourceControlOwnership> = {
  value: ResourceControlOwnership.PUBLIC,
  label: '公开的',
  id: 'access_public',
  description:
    '我希望任何有权限进入这个环境的用户都能管理这个资源',
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
      '我想把这个资源的管理限制在只有管理员可以管理的范围内',
      ResourceControlOwnership.ADMINISTRATORS
    ),
    buildOption(
      'access_restricted',
      <BadgeIcon icon={ownershipIcon('restricted')} />,
      '受限的',
      '我想把这个资源的管理限制在一组用户和/或团队中',
      ResourceControlOwnership.RESTRICTED
    ),
  ];
}
function nonAdminOptions(teams?: Team[]) {
  return _.compact([
    buildOption(
      'access_private',
      <BadgeIcon icon={ownershipIcon('private')} />,
      '私人的',
      '我希望这个资源仅能由我自己管理。',
      ResourceControlOwnership.PRIVATE
    ),
    teams &&
      teams.length > 0 &&
      buildOption(
        'access_restricted',
        <BadgeIcon icon={ownershipIcon('restricted')} />,
        '受限的',
        teams.length === 1
          ? `我希望我的团队的任何成员 (${teams[0].Name})  都能管理这个资源`
          : '我想把这个资源的管理限制在我的一个或多个团队中。',
        ResourceControlOwnership.RESTRICTED
      ),
  ]);
}
