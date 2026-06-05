import { useMutation } from '@tanstack/react-query';

import PortainerError from '@/portainer/error';
import { applyResourceControl } from '@/react/portainer/access-control/access-control.service';
import { AccessControlFormData } from '@/react/portainer/access-control/types';
import axios from '@/portainer/services/axios';
import { buildStackUrl } from '@/react/common/stacks/queries/buildUrl';
import { Stack } from '@/react/common/stacks/types';
import { withGlobalError } from '@/react-tools/react-query';

export function useAssociateStackToEnvironmentMutation() {
  return useMutation({
    mutationFn: associateStackToEnvironmentMutation,
    ...withGlobalError('关联堆栈到环境失败'),
  });
}

async function associateStackToEnvironmentMutation({
  environmentId,
  stackId,
  isOrphanedRunning,
  accessControl,
  swarmId,
}: {
  environmentId: number;
  stackId: number;
  isOrphanedRunning?: boolean;
  accessControl: AccessControlFormData;
  swarmId?: string;
}) {
  const associatedStack = await associate({
    environmentId,
    stackId,
    isOrphanedRunning,
    swarmId,
  });

  const resourceControl = associatedStack.ResourceControl;
  if (!resourceControl) {
    throw new PortainerError('resource control expected after creation');
  }

  await applyResourceControl(accessControl, resourceControl.Id);
}

async function associate({
  environmentId,
  stackId,
  isOrphanedRunning,
  swarmId,
}: {
  environmentId: number;
  stackId: number;
  isOrphanedRunning?: boolean;
  swarmId?: string;
}) {
  const { data } = await axios.put<Stack>(
    buildStackUrl(stackId, 'associate'),
    {},
    {
      params: {
        endpointId: environmentId,
        orphanedRunning: isOrphanedRunning ?? false,
        swarmId,
      },
    }
  );

  return data;
}
