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
      label="授权用户"
      tooltip={
        users.length > 0
          ? '您可以选择允许哪些用户管理此资源。'
          : undefined
      }
      inputId="authorized-users-selector"
      errors={errors}
    >
      {users.length > 0 ? (
        <UsersSelector
          name={name}
          users={users}
          onChange={onChange}
          value={value}
          inputId="authorized-users-selector"
          dataCy="users-selector"
        />
      ) : (
        <span className="small text-muted">
          您还未创建任何用户。请前往{' '}
          <Link to="portainer.users" data-cy="access-control-users-link">
            用户视图
          </Link>{' '}
          以管理用户。
        </span>
      )}
    </FormControl>
  );
}
