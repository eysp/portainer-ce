import { Input } from '@@/form-components/Input';
import { InputListActionButtons } from '@@/form-components/InputList/ActionButtons';
import { FormControl } from '@@/form-components/FormControl';

import { LDAPGroupSearchSettings } from '../../types';

interface AdminGroupSearchConfigItemProps {
  value: LDAPGroupSearchSettings;
  index: number;
  count: number;
  isLimited: boolean;
  onChange: (value: LDAPGroupSearchSettings) => void;
  onRemove: () => void;
}

export function AdminGroupSearchConfigItem({
  value,
  index,
  count,
  isLimited,
  onChange,
  onRemove,
}: AdminGroupSearchConfigItemProps) {
  return (
    <>
      <div className="flex gap-5">
        <FormControl
          size="large"
          className="w-1/2 flex-1"
          label="组基础 DN"
          tooltip="LDAP 服务器将从中搜索组的元素的专有名称。"
          inputId={`ldap_admin_group_basedn_${index}`}
        >
          <Input
            id={`ldap_admin_group_basedn_${index}`}
            data-cy="ldap-admin-group-basedn"
            value={value.GroupBaseDN}
            onChange={(e) =>
              onChange({ ...value, GroupBaseDN: e.target.value })
            }
            placeholder="dc=ldap,dc=domain,dc=tld"
            disabled={isLimited}
            className={isLimited ? 'limited-be border-0' : undefined}
          />
        </FormControl>

        <FormControl
          size="large"
          className="w-1/2 flex-1"
          label="组成员属性"
          tooltip="表示组成员身份的 LDAP 属性。"
          inputId={`ldap_admin_group_att_${index}`}
        >
          <Input
            id={`ldap_admin_group_att_${index}`}
            data-cy="ldap-admin-group-att"
            value={value.GroupAttribute}
            onChange={(e) =>
              onChange({ ...value, GroupAttribute: e.target.value })
            }
            placeholder="member"
            disabled={isLimited}
            className={isLimited ? 'limited-be border-0' : undefined}
          />
        </FormControl>
      </div>

      <div className="flex">
        <FormControl
          size="small"
          className="w-full flex-1"
          label="组过滤"
          tooltip="用于选择组元素的 LDAP 搜索过滤器，可选。"
          inputId={`ldap_admin_group_filter_${index}`}
        >
          <div className="vertical-center">
            <Input
              id={`ldap_admin_group_filter_${index}`}
              data-cy="ldap-admin-group-filter"
              value={value.GroupFilter}
              onChange={(e) =>
                onChange({ ...value, GroupFilter: e.target.value })
              }
              placeholder="(objectClass=groupOfNames)"
              className={isLimited ? 'limited-be border-0' : undefined}
              disabled={isLimited}
            />
            <InputListActionButtons
              index={index}
              count={count}
              showDelete={index > 0}
              onDelete={onRemove}
              disabled={isLimited}
              data-cy="admin-group-search"
            />
          </div>
        </FormControl>
      </div>
    </>
  );
}
