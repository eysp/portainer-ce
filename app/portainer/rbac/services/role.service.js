import { RoleViewModel, RoleTypes } from '../models/role';

export function RoleService() {
  const rolesData = [
    new RoleViewModel(RoleTypes.ENDPOINT_ADMIN, 'Environment administrator', '完全控制环境中的所有资源', []),
    new RoleViewModel(RoleTypes.OPERATOR, 'Operator', '环境中所有现有资源的操作控制', []),
    new RoleViewModel(RoleTypes.HELPDESK, 'Helpdesk', '对环境中所有资源的只读访问', []),
    new RoleViewModel(RoleTypes.READ_ONLY, 'Read-only user', '对环境中已分配资源的只读访问权限', []),
    new RoleViewModel(RoleTypes.STANDARD, 'Standard user', '完全控制环境中分配的资源', []),
  ];

  return {
    roles,
  };

  function roles() {
    return rolesData;
  }
}
