import { Team } from '@/react/portainer/users/teams/types';

import { TeamsSelector } from '@@/TeamsSelector';
import { FormControl } from '@@/form-components/FormControl';
import { Link } from '@@/Link';

interface Props {
  name: string;
  teams: Team[];
  value: number[];
  overrideTooltip?: string;
  onChange(value: number[]): void;
  errors?: string | string[];
}

export function TeamsField({
  name,
  teams,
  value,
  overrideTooltip,
  onChange,
  errors,
}: Props) {
  return (
    <FormControl
      label="授权团队"
      tooltip={
        teams.length > 0
          ? overrideTooltip ||
            '您可以选择哪些团队将能够管理此资源。'
          : undefined
      }
      inputId="teams-selector"
      errors={errors}
    >
      {teams.length > 0 ? (
        <TeamsSelector
          name={name}
          teams={teams}
          onChange={onChange}
          value={value}
          inputId="teams-selector"
        />
      ) : (
        <span className="small text-muted">
          您尚未创建任何团队。请前往{' '}
          <Link to="portainer.teams">团队管理</Link> 页面管理团队。
        </span>
      )}
    </FormControl>
  );
}
