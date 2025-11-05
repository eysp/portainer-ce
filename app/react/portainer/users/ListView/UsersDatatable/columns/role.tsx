import { User, UserPlus } from 'lucide-react';

import { isEdgeAdmin } from '@/portainer/users/user.helpers';
import { RoleNames } from '@/portainer/users/types';

import { Icon } from '@@/Icon';

import { helper } from './helper';

export const role = helper.accessor(
  (item) =>
    `${RoleNames[item.Role]} ${
      item.isTeamLeader ? ' - 团队负责人' : ''
    }`.trim(),
  {
    header: '角色',
    cell: ({ getValue, row: { original: item } }) => {
      const icon =
        isEdgeAdmin({ Role: item.Role }) || item.isTeamLeader ? User : UserPlus;

      return (
        <span className="vertical-center">
          <Icon icon={icon} />
          {getValue() || '-'}
        </span>
      );
    },
  }
);
