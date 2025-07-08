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
          因为已启用外部身份验证并使用团队同步，团队领导功能已被禁用。
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
          注意：默认情况下，未加入任何团队的非管理员用户无法访问任何环境。请前往{' '}
          <Link to="portainer.endpoints" data-cy="env-link">
            环境视图
          </Link>{' '}
          来管理他们的访问权限。
        </TextTip>
      </div>
    </div>
  );
}
