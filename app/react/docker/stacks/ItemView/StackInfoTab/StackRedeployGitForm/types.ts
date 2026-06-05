import { GitAuthModel, AutoUpdateModel } from '@/react/portainer/gitops/types';

import { EnvVarValues } from '@@/form-components/EnvironmentVariablesFieldset';

export interface FormValues {
  refName: string;
  env: EnvVarValues;
  prune: boolean;

  tlsSkipVerify: boolean;

  auth: GitAuthModel;
  autoUpdate: AutoUpdateModel;
}
