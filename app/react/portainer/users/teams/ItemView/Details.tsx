import { useRouter } from '@uirouter/react';
import { useMutation, useQueryClient } from 'react-query';
import { Trash2, Users } from 'react-feather';

import { confirmDeletionAsync } from '@/portainer/services/modal.service/confirm';
import { usePublicSettings } from '@/react/portainer/settings/queries';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import { Button } from '@@/buttons';
import { Widget } from '@@/Widget';

import { Team, TeamId, TeamMembership, TeamRole } from '../types';
import { deleteTeam } from '../teams.service';

interface Props {
  team: Team;
  memberships: TeamMembership[];
  isAdmin: boolean;
}

export function Details({ team, memberships, isAdmin }: Props) {
  const deleteMutation = useDeleteTeam();
  const router = useRouter();
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const leaderCount = memberships.filter(
    (m) => m.Role === TeamRole.Leader
  ).length;

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-xs-12">
        <Widget>
          <Widget.Title title="团队详细信息" icon={Users} />

          <Widget.Body className="no-padding">
            <table className="table">
              <tbody>
                <tr>
                  <td>名称</td>
                  <td>
                    {!teamSyncQuery.data && team.Name}
                    {isAdmin && (
                      <Button
                        color="danger"
                        size="xsmall"
                        onClick={handleDeleteClick}
                        icon={Trash2}
                      >
                        删除此团队
                      </Button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>领导</td>
                  <td>{!teamSyncQuery.data && leaderCount}</td>
                </tr>
                <tr>
                  <td>团队中的用户总数</td>
                  <td>{memberships.length}</td>
                </tr>
              </tbody>
            </table>
          </Widget.Body>
        </Widget>
      </div>
    </div>
  );

  async function handleDeleteClick() {
    const confirmed = await confirmDeletionAsync(
      `是否要删除此团队？不会删除此团队中的用户。`
    );
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(team.Id, {
      onSuccess() {
        router.stateService.go('portainer.teams');
      },
    });
  }
}

function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: TeamId) => deleteTeam(id),

    mutationOptions(
      withError('无法删除团队'),
      withInvalidate(queryClient, [['teams']])
    )
  );
}
