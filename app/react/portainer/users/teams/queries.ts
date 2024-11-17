import { useMutation, useQuery, useQueryClient } from 'react-query';

import { promiseSequence } from '@/portainer/helpers/promise-utils';
import { notifyError } from '@/portainer/services/notifications';
import { UserId } from '@/portainer/users/types';

import {
  createTeamMembership,
  deleteTeamMembership,
  updateTeamMembership,
} from './team-membership.service';
import { getTeam, getTeamMemberships, getTeams } from './teams.service';
import { Team, TeamId, TeamMembership, TeamRole } from './types';

export function useTeams<T = Team[]>(
  onlyLedTeams = false,
  environmentId = 0,
  {
    enabled = true,
    select = (data) => data as unknown as T,
  }: {
    enabled?: boolean;
    select?: (data: Team[]) => T;
  } = {}
) {
  const teams = useQuery(
    ['teams', { onlyLedTeams, environmentId }],
    () => getTeams(onlyLedTeams, environmentId),
    {
      meta: {
        error: { title: '失败', message: '无法加载团队' },
      },
      enabled,
      select,
    }
  );

  return teams;
}

export function useTeam(id: TeamId, onError?: (error: unknown) => void) {
  return useQuery(['teams', id], () => getTeam(id), {
    meta: {
      error: { title: '失败', message: '无法加载团队' },
    },
    onError,
  });
}

export function useTeamMemberships(id: TeamId) {
  return useQuery(['teams', id, 'memberships'], () => getTeamMemberships(id), {
    meta: {
      error: { title: '失败', message: '无法加载团队成员资格' },
    },
  });
}

export function useAddMemberMutation(teamId: TeamId) {
  const queryClient = useQueryClient();

  return useMutation(
    (userIds: UserId[]) =>
      promiseSequence(
        userIds.map(
          (userId) => () =>
            createTeamMembership(userId, teamId, TeamRole.Member)
        )
      ),
    {
      onError(error) {
        notifyError('失败', error as Error, '添加成员资格失败');
      },
      onSuccess() {
        queryClient.invalidateQueries(['teams', teamId, 'memberships']);
      },
    }
  );
}

export function useRemoveMemberMutation(
  teamId: TeamId,
  teamMemberships: TeamMembership[] = []
) {
  const queryClient = useQueryClient();

  return useMutation(
    (userIds: UserId[]) =>
      promiseSequence(
        userIds.map((userId) => () => {
          const membership = teamMemberships.find(
            (membership) => membership.UserID === userId
          );
          if (!membership) {
            throw new Error('未找到成员资格');
          }
          return deleteTeamMembership(membership.Id);
        })
      ),
    {
      onError(error) {
        notifyError('失败', error as Error, '添加成员资格失败');
      },
      onSuccess() {
        queryClient.invalidateQueries(['teams', teamId, 'memberships']);
      },
    }
  );
}

export function useUpdateRoleMutation(
  teamId: TeamId,
  teamMemberships: TeamMembership[] = []
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ userId, role }: { userId: UserId; role: TeamRole }) => {
      const membership = teamMemberships.find(
        (membership) => membership.UserID === userId
      );
      if (!membership) {
        throw new Error('未找到成员资格');
      }
      return updateTeamMembership(membership.Id, userId, teamId, role);
    },
    {
      onError(error) {
        notifyError('失败', error as Error, '更新成员资格失败');
      },
      onSuccess() {
        queryClient.invalidateQueries(['teams', teamId, 'memberships']);
      },
    }
  );
}
