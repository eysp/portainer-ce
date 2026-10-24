import { EnvironmentId } from '@/react/portainer/environments/types';
import { AuthorizationMap } from '@/react/portainer/users/RolesView/types';

import { type UserId } from './types/user-id';

export { type UserId };

export enum Role {
  Admin = 1,
  Standard,
  EdgeAdmin,
}

export const RoleNames: { [key in Role]: string } = {
  [Role.Admin]: '管理员',
  [Role.Standard]: '普通用户',
  [Role.EdgeAdmin]: '边缘管理员',
};

export type ThemeColor = 'dark' | 'light' | 'highcontrast' | 'auto';

export type User = {
  Id: UserId;
  Username: string;
  Role: Role;
  EndpointAuthorizations: {
    [endpointId: EnvironmentId]: AuthorizationMap;
  };
  UseCache: boolean;
  ThemeSettings: {
    color: ThemeColor;
  };
};
