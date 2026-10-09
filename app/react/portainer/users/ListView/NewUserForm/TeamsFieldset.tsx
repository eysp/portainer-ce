import { useFormikContext } from 'formik';

import { useCurrentUser } from '@/react/hooks/useUser';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

import { useTeams } from '../../teams/queries';

import { AdminSwitch } from './AdminSwitch';
import { FormValues } from './FormValues';
import { TeamsField } from './TeamsField';

export function TeamsFieldset() {
  const { values } = useFormikContext<FormValues>();
  const { isPureAdmin } = useCurrentUser();
  const teamsQuery = useTeams(!isPureAdmin);
  const settingsQuery = usePublicSettings();
  if (!teamsQuery.data || !settingsQuery.data) {
    return null;
  }

  const { TeamSync: teamSync } = settingsQuery.data;

  return (
    <>
      {isPureAdmin && <AdminSwitch />}

      {!values.isAdmin && (
        <TeamsField teams={teamsQuery.data} disabled={teamSync} />
      )}

      {teamSync && <TeamSyncMessage />}

      {isPureAdmin && !values.isAdmin && values.teams.length === 0 && (
        <NoTeamSelected />
      )}
    </>
  );
}

function TeamSyncMessage() {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="orange">
          由于当前启用了带有团队同步的外部身份验证，团队负责人功能已被禁用。
        </TextTip>
      </div>
    </div>
  );
}

function NoTeamSelected() {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="blue">
          注意：默认情况下，未加入任何团队的非管理员用户无权访问任何环境。请前往{' '}
          <Link to="portainer.endpoints" data-cy="env-link">
            环境管理
          </Link>{' '}
          配置其访问权限。
        </TextTip>
      </div>
    </div>
  );
}
