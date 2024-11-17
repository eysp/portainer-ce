import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { useEnvironmentList } from '@/react/portainer/environments/queries/useEnvironmentList';
import {
  Environment,
  EnvironmentType,
} from '@/react/portainer/environments/types';
import {
  createLocalDockerEnvironment,
  createLocalKubernetesEnvironment,
} from '@/react/portainer/environments/environment.service/create';

export function useConnectLocalEnvironment(): {
  status: '错误' | '加载中' | '成功';
  type?: EnvironmentType;
} {
  const [localEnvironment, setLocalEnvironment] = useState<Environment>();

  const { isLoading, environment } = useFetchLocalEnvironment();

  const createLocalEnvironmentMutation = useMutation(createLocalEnvironment);

  const { mutate } = createLocalEnvironmentMutation;

  useEffect(() => {
    if (isLoading || localEnvironment) {
      return;
    }

    if (environment) {
      setLocalEnvironment(environment);
      return;
    }

    mutate(undefined, {
      onSuccess(environment) {
        setLocalEnvironment(environment);
      },
    });
  }, [environment, isLoading, localEnvironment, mutate]);

  return {
    status: getStatus(isLoading, createLocalEnvironmentMutation.status),
    type: localEnvironment?.Type,
  };
}

function getStatus(
  isLoading: boolean,
  mutationStatus: '加载中' | '错误' | '成功' | '空闲'
): '加载中' | '错误' | '成功' {
  if (isLoading || mutationStatus === '加载中') {
    return '加载中';
  }

  if (mutationStatus === '错误') {
    return '错误';
  }

  return '成功';
}

async function createLocalEnvironment() {
  try {
    return await createLocalKubernetesEnvironment({ name: 'local' });
  } catch (err) {
    return await createLocalDockerEnvironment({ name: 'local' });
  }
}

function useFetchLocalEnvironment() {
  const { environments, isLoading } = useEnvironmentList(
    {
      page: 0,
      pageLimit: 1,
      types: [
        EnvironmentType.Docker,
        EnvironmentType.AgentOnDocker,
        EnvironmentType.KubernetesLocal,
      ],
    },
    {
      refetchInterval: false,
      staleTime: Infinity,
    }
  );

  let environment: Environment | undefined;
  environments.forEach((value) => {
    if (!environment) {
      if (value.Type === EnvironmentType.AgentOnDocker) {
        if (value.Name === 'primary' && value.Id === 1) {
          environment = value;
        }
      } else {
        environment = value;
      }
    }
  });

  return {
    isLoading,
    environment,
  };
}
