import { useRouter } from '@uirouter/react';

import { useUsers } from '@/portainer/users/queries';
import { useIsPureAdmin } from '@/react/hooks/useUser';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { TextTip } from '@@/Tip/TextTip';
import { PageHeader } from '@@/PageHeader';

import { useTeam, useTeamMemberships } from '../queries';

import { Details } from './Details';
import { TeamAssociationSelector } from './TeamAssociationSelector';
import { useTeamIdParam } from './useTeamIdParam';

export function ItemView() {
  const teamId = useTeamIdParam();

  const isPureAdmin = useIsPureAdmin();
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
        title="团队详情"
        breadcrumbs={[{ label: '团队' }, { label: team.Name }]}
        reload
      />

      {membershipsQuery.data && (
        <Details
          team={team}
          memberships={membershipsQuery.data}
          isAdmin={isPureAdmin}
        />
      )}

      {teamSyncQuery.data && (
        <div className="row">
          <div className="col-sm-12">
            <TextTip color="orange">
              因为当前启用了与团队同步的外部身份验证，团队负责人功能已被禁用。
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
