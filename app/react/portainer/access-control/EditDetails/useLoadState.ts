import { useTeams } from '@/react/portainer/users/teams/queries';
import { useUsers } from '@/portainer/users/queries';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { useIsEdgeAdmin } from '@/react/hooks/useUser';

export function useLoadState(environmentId: EnvironmentId) {
  const isAdminQuery = useIsEdgeAdmin();
  // For access control selection, we must list all teams/users, not only those already tied to an environment.
  // Hence use environmentId = 0 to fetch the global lists.
  const teams = useTeams(false, 0);

  const users = useUsers(false, 0, isAdminQuery.isAdmin);

  return {
    teams: teams.data,
    users: users.data,
    isAdmin: isAdminQuery.isAdmin,
    isLoading:
      teams.isInitialLoading ||
      users.isInitialLoading ||
      isAdminQuery.isLoading,
  };
}
