import { useQueryClient, useMutation } from 'react-query';

import { promiseSequence } from '@/portainer/helpers/promise-utils';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { deleteEndpoint } from '../environment.service';

export function useDeleteEnvironmentsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: Array<EnvironmentId>) =>
      promiseSequence(ids.map((id) => () => deleteEndpoint(id))),
    mutationOptions(
      withError('删除环境失败'),
      withInvalidate(queryClient, [['environments']])
    )
  );
}
