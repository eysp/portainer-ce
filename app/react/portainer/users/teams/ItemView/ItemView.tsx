import { useRouter } from '@uirouter/react';

import { useUsers } from '@/portainer/users/queries';
import { useUser } from '@/portainer/hooks/useUser';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { TextTip } from '@@/Tip/TextTip';
import { PageHeader } from '@@/PageHeader';

import { useTeam, useTeamMemberships } from '../queries';

import { Details } from './Details';
import { TeamAssociationSelector } from './TeamAssociationSelector';
import { useTeamIdParam } from './useTeamIdParam';

export function ItemView() {
  const teamId = useTeamIdParam();

  const { isAdmin } = useUser();
  const router = useRouter();
  const teamQuery = useTeam(teamId, () =>
    router.stateService.go('portainer.teams')
  );
  const usersQuery = useUsers();
  const membershipsQuery = useTeamMemberships(teamId);
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  if (!teamQuery.data) {
    return null;
  }

  const team = teamQuery.data;

  return (
    <>
      <PageHeader
        title="团队详细信息"
        breadcrumbs={[{ label: 'Teams' }, { label: team.Name }]}
      />

      {membershipsQuery.data && (
        <Details
          team={team}
          memberships={membershipsQuery.data}
          isAdmin={isAdmin}
        />
      )}

      {teamSyncQuery.data && (
        <div className="row">
          <div className="col-sm-12">
            <TextTip color="orange">
            团队领导的功能被禁用，因为目前团队同步的外部认证已经启用。
              目前启用了团队同步的外部认证。
            </TextTip>
          </div>
        </div>
      )}

      {usersQuery.data && membershipsQuery.data && (
        <TeamAssociationSelector
          teamId={teamId}
          memberships={membershipsQuery.data}
          users={usersQuery.data}
          disabled={teamSyncQuery.data}
        />
      )}
    </>
  );
}
