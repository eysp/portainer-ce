import { useMutation, useQueryClient } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withError } from '@/react-tools/react-query';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { pluralize } from '@/portainer/helpers/strings';

import { buildUrl } from '../environment.service/utils';
import { EnvironmentId } from '../types';

export function useDeleteEnvironmentsMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async (
      environments: {
        id: EnvironmentId;
        name: string;
        deleteCluster?: boolean;
      }[]
    ) => {
      const resp = await deleteEnvironments(environments);

      if (resp === null) {
        return { deleted: environments, errors: [] };
      }

      return {
        deleted: environments.filter((e) =>
          (resp.deleted || []).includes(e.id)
        ),
        errors: environments.filter((e) => (resp.errors || []).includes(e.id)),
      };
    },
    {
      ...withError('无法删除环境'),
      onSuccess: ({ deleted, errors }) => {
        queryClient.invalidateQueries(['environments']);
        // show an error message for each env that failed to delete
        errors.forEach((e) => {
          notifyError(`删除环境 ${e.name} 失败`, undefined);
        });
        // show one summary message for all successful deletes
        if (deleted.length) {
          notifySuccess(
            `${pluralize(deleted.length, 'Environment')} 成功删除`,
            deleted.map((d) => d.name).join(', ')
          );
        }
      },
    }
  );
}

async function deleteEnvironments(
  environments: { id: EnvironmentId; deleteCluster?: boolean }[]
) {
  try {
    const { data } = await axios.delete<{
      deleted: EnvironmentId[];
      errors: EnvironmentId[];
    } | null>(buildUrl(), {
      data: { endpoints: environments },
    });
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除环境');
  }
}
