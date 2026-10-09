import { helper } from './helper';

const authMethodLabels: Record<string, string> = {
  Internal: '内部认证',
  LDAP: 'LDAP',
  OAuth: 'OAuth',
  AD: 'Active Directory',
};

export const authentication = helper.accessor('authMethod', {
  header: '认证方式',
  cell: ({ getValue }) => {
    const val = getValue();
    return authMethodLabels[val] || val || '-';
  },
});
