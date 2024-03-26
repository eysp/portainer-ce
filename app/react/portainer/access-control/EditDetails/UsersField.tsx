import { User } from '@/portainer/users/types';

import { UsersSelector } from '@@/UsersSelector';
import { FormControl } from '@@/form-components/FormControl';
import { Link } from '@@/Link';

interface Props {
  name: string;
  users: User[];
  value: number[];
  onChange(value: number[]): void;
  errors?: string | string[];
}

export function UsersField({ name, users, value, onChange, errors }: Props) {
  return (
    <FormControl
  label="已授权用户"
  tooltip={
    users.length > 0
      ? '您可以选择哪些用户能够管理此资源。'
      : undefined
  }
  inputId="users-selector"
  errors={errors}
>
  {users.length > 0 ? (
    <UsersSelector
      name={name}
      users={users}
      onChange={onChange}
      value={value}
      inputId="users-selector"
    />
  ) : (
    <span className="small text-muted">
      您尚未创建任何用户。请转到<Link to="portainer.users">用户视图</Link>管理用户。
    </span>
  )}
</FormControl>
  );
}
