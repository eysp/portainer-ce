import { useMemo } from 'react';
import { object, string } from 'yup';

import { accessControlFormValidation } from '@/react/portainer/access-control/AccessControlForm';
import { useNameValidation } from '@/react/docker/stacks/common/NameField';
import { variablesFieldValidation } from '@/react/portainer/custom-templates/components/CustomTemplatesVariablesField';
import { VariableDefinition } from '@/react/portainer/custom-templates/components/CustomTemplatesVariablesDefinitionField';
import { EnvironmentId } from '@/react/portainer/environments/types';

export function useValidation({
  environmentId,
  isAdmin,
  variableDefs,
  isDeployable,
}: {
  variableDefs: Array<VariableDefinition>;
  isAdmin: boolean;
  environmentId: EnvironmentId;
  isDeployable: boolean;
}) {
  const name = useNameValidation(environmentId);

  return useMemo(
    () =>
      object({
        name: name.test({
          name: 'is-deployable',
          message: '此模板无法在此环境中部署',
          test: () => isDeployable,
        }),
        accessControl: accessControlFormValidation(isAdmin),
        fileContent: string().required('Required'),
        variables: variablesFieldValidation(variableDefs),
      }),
    [isAdmin, isDeployable, name, variableDefs]
  );
}
