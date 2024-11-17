import { RoleViewModel, RoleTypes } from '../models/role';

export function RoleService() {
  const rolesData = [
    new RoleViewModel(RoleTypes.ENDPOINT_ADMIN, '环境管理员', '对环境中所有资源的完全控制', []),
    new RoleViewModel(RoleTypes.OPERATOR, '操作员', '对环境中所有现有资源的操作控制', []),
    new RoleViewModel(RoleTypes.HELPDESK, '帮助台', '对环境中所有资源的只读访问权限', []),
    new RoleViewModel(RoleTypes.READ_ONLY, '只读用户', '对环境中分配资源的只读访问权限', []),
    new RoleViewModel(RoleTypes.STANDARD, '标准用户', '对环境中分配资源的完全控制', []),
  ];

  return {
    roles,
  };

  function roles() {
    return rolesData;
  }
}
