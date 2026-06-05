import { array, boolean, number, object, SchemaOf, string } from 'yup';

import { useCurrentUser } from '@/react/hooks/useUser';
import { useGitCredentials } from '@/react/portainer/account/git-credentials/git-credentials.service';
import { gitAuthValidation } from '@/react/portainer/gitops/AuthFieldset';
import { autoUpdateValidation } from '@/react/portainer/gitops/AutoUpdateFieldset/validation';

import { envVarValidation } from '@@/form-components/EnvironmentVariablesFieldset';

import { FormValues } from './types';

export function useValidationSchema({
  isAuthEdit,
}: {
  isAuthEdit: boolean;
}): SchemaOf<FormValues> {
  const { user } = useCurrentUser();
  const gitCredentialsQuery = useGitCredentials(user.Id);

  return object({
    auth: gitAuthValidation(gitCredentialsQuery.data || [], isAuthEdit, false),
    refName: string().default(''),
    env: envVarValidation(),
    prune: boolean().default(false),
    registries: array(number().required()),
    tlsSkipVerify: boolean().default(false),
    autoUpdate: autoUpdateValidation(),
  });
}
