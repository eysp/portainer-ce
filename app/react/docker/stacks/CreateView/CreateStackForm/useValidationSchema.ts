import { useMemo } from 'react';
import _ from 'lodash';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { useStacks } from '@/react/common/stacks/queries/useStacks';
import { useContainers } from '@/react/docker/containers/queries/useContainers';
import { useGitCredentials } from '@/react/portainer/account/git-credentials/git-credentials.service';
import { useCurrentUser, useIsEdgeAdmin } from '@/react/hooks/useUser';

import { getValidationSchema } from './validation';

export function useValidationSchema(environmentId: EnvironmentId) {
  const { user } = useCurrentUser();
  const { isAdmin } = useIsEdgeAdmin();

  const stacksQuery = useStacks();
  const containersQuery = useContainers(environmentId, {
    select: (containers) =>
      containers.flatMap((c) => c.Names).map((name) => _.trimStart(name, '/')),
  });
  const gitCredentialsQuery = useGitCredentials(user.Id);

  const containerNames = containersQuery.data;
  const stacks = stacksQuery.data;
  const gitCredentials = gitCredentialsQuery.data;

  return useMemo(
    () =>
      getValidationSchema({
        isAdmin,
        environmentId,
        stacks,
        containerNames,
        gitCredentials,
      }),
    [isAdmin, environmentId, stacks, containerNames, gitCredentials]
  );
}
