import { RoleViewModel, RoleTypes } from '../models/role';

export function RoleService() {
  const rolesData = [
    new RoleViewModel(RoleTypes.ENDPOINT_ADMIN, 'Environment administrator', '完全控制环境中的所有资源', []),
    new RoleViewModel(RoleTypes.OPERATOR, 'Operator', '环境中所有现有资源的运营控制', []),
    new RoleViewModel(RoleTypes.HELPDESK, 'Helpdesk', '环境中所有资源的只读访问', []),
    new RoleViewModel(RoleTypes.READ_ONLY, 'Read-only user', '环境中分配资源的只读访问', []),
    new RoleViewModel(RoleTypes.STANDARD, 'Standard user', '完全控制环境中的分配资源', []),
  ];

  return {
    roles,
  };

  function roles() {
    return rolesData;
  }
}
