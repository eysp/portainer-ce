import { useMutation, useQueryClient } from 'react-query';

import { promiseSequence } from '@/portainer/helpers/promise-utils';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import { buildUrl } from '../environment.service/utils';
import { EnvironmentId } from '../types';

export function useDeleteEnvironmentsMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (environments: EnvironmentId[]) =>
      promiseSequence(
        environments.map(
          (environmentId) => () => deleteEnvironment(environmentId)
        )
      ),
    mutationOptions(
      withError('无法删除环境'),
      withInvalidate(queryClient, [['environments']])
    )
  );
}

async function deleteEnvironment(id: EnvironmentId) {
  try {
    await axios.delete(buildUrl(id));
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除环境');
  }
}
