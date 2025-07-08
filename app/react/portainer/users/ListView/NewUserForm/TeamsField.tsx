import { useField } from 'formik';

import { Link } from '@@/Link';
import { TeamsSelector } from '@@/TeamsSelector';
import { FormControl } from '@@/form-components/FormControl';

import { Team } from '../../teams/types';

import { FormValues } from './FormValues';

export function TeamsField({
  teams,
  disabled,
}: {
  teams: Array<Team>;
  disabled?: boolean;
}) {
  const [{ name, value }, { error }, { setValue }] =
    useField<FormValues['teams']>('teams');

  return (
    <FormControl label="添加到团队" inputId="teams-field" errors={error}>
      {teams.length > 0 ? (
        <TeamsSelector
          dataCy="user-teamSelect"
          onChange={(value) => setValue(value)}
          value={value}
          name={name}
          teams={teams}
          inputId="teams-field"
          disabled={disabled}
        />
      ) : (
        <span className="small text-muted">
          你似乎还没有可以添加用户的团队。请前往{' '}
          <Link to="portainer.teams" data-cy="teams-view-link">
            团队视图
          </Link>{' '}
          创建团队。
        </span>
      )}
    </FormControl>
  );
}
