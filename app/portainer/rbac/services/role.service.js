import { RoleViewModel, RoleTypes } from '../models/role';

export function RoleService() {
  const rolesData = [
    new RoleViewModel(RoleTypes.ENDPOINT_ADMIN, '环境管理员', '对环境中的所有资源具有完全控制权限', []),
    new RoleViewModel(RoleTypes.OPERATOR, '操作员', '对环境中的所有现有资源具有操作权限', []),
    new RoleViewModel(RoleTypes.HELPDESK, '帮助台', '对环境中的所有资源具有只读访问权限', []),
    new RoleViewModel(RoleTypes.READ_ONLY, '只读用户', '对分配给环境中的资源具有只读访问权限', []),
    new RoleViewModel(RoleTypes.STANDARD, '标准用户', '对分配给环境中的资源具有完全控制权限', []),
  ];

  return {
    roles,
  };

  function roles() {
    return rolesData;
  }
}
