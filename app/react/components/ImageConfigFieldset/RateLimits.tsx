import { useQuery } from 'react-query';
import { useEffect } from 'react';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useCurrentUser } from '@/react/hooks/useUser';
import { buildUrl } from '@/react/portainer/environments/environment.service/utils';
import {
  Environment,
  EnvironmentType,
} from '@/react/portainer/environments/types';
import {
  isAgentEnvironment,
  isLocalEnvironment,
} from '@/react/portainer/environments/utils';
import { RegistryId } from '@/react/portainer/registries/types/registry';
import { useRegistry } from '@/react/portainer/registries/queries/useRegistry';

import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

import { getIsDockerHubRegistry } from './utils';

export function RateLimits({
  registryId,
  onRateLimit,
}: {
  registryId?: RegistryId;
  onRateLimit: (limited?: boolean) => void;
}) {
  const registryQuery = useRegistry(registryId);

  const registry = registryQuery.data;

  const isDockerHubRegistry = getIsDockerHubRegistry(registry);

  const environmentQuery = useCurrentEnvironment();

  if (
    !environmentQuery.data ||
    registryQuery.isLoading ||
    !isDockerHubRegistry
  ) {
    return null;
  }

  return (
    <RateLimitsInner
      isAuthenticated={registry?.Authentication}
      registryId={registryId}
      onRateLimit={onRateLimit}
      environment={environmentQuery.data}
    />
  );
}

function RateLimitsInner({
  isAuthenticated = false,
  registryId = 0,
  onRateLimit,
  environment,
}: {
  isAuthenticated?: boolean;
  registryId?: RegistryId;
  onRateLimit: (limited?: boolean) => void;
  environment: Environment;
}) {
  const pullRateLimits = useRateLimits(registryId, environment, onRateLimit);
  const { isPureAdmin } = useCurrentUser();

  if (!pullRateLimits) {
    return null;
  }

  return (
    <div className="form-group">
      <div className="col-sm-12">
        {pullRateLimits.remaining > 0 ? (
          <TextTip color="blue">
            {isAuthenticated ? (
              <>
                您当前正在使用免费账户从 DockerHub 拉取镜像，每 6 小时将限制 200 次拉取。
                剩余拉取次数：
                <span className="font-bold">
                  {pullRateLimits.remaining}/{pullRateLimits.limit}
                </span>
              </>
            ) : (
              <>
                {isPureAdmin ? (
                  <>
                    您当前正在使用匿名账户从 DockerHub 拉取镜像，每 6 小时将限制 100 次拉取。
                    您可以在{' '}
                    <Link to="portainer.registries">注册表视图</Link>中配置 DockerHub 身份验证。
                    剩余拉取次数：{' '}
                    <span className="font-bold">
                      {pullRateLimits.remaining}/{pullRateLimits.limit}
                    </span>
                  </>
                ) : (
                  <>
                    您当前正在使用匿名账户从 DockerHub 拉取镜像，每 6 小时将限制 100 次拉取。
                    请联系您的管理员配置 DockerHub 身份验证。剩余拉取次数：{' '}
                    <span className="font-bold">
                      {pullRateLimits.remaining}/{pullRateLimits.limit}
                    </span>
                  </>
                )}
              </>
            )}
          </TextTip>
        ) : (
          <TextTip>
            {isAuthenticated ? (
              <>
                作为免费用户，您的授权拉取次数配额已超出。
                您将无法从 DockerHub 注册表中拉取任何镜像。
              </>
            ) : (
              <>
                作为匿名用户，您的授权拉取次数配额已超出。
                您将无法从 DockerHub 注册表中拉取任何镜像。
              </>
            )}
          </TextTip>
        )}
      </div>
    </div>
  );
}

interface PullRateLimits {
  remaining: number;
  limit: number;
}

function useRateLimits(
  registryId: RegistryId,
  environment: Environment,
  onRateLimit: (limited?: boolean) => void
) {
  const isValidForPull =
    isAgentEnvironment(environment.Type) || isLocalEnvironment(environment);

  const query = useQuery(
    ['dockerhub', environment.Id, registryId],
    () => getRateLimits(environment, registryId),
    {
      enabled: isValidForPull,
    }
  );

  useEffect(() => {
    if (!isValidForPull || query.isError) {
      onRateLimit();
    }

    if (query.data) {
      onRateLimit(query.data.limit > 0 && query.data.remaining === 0);
    }
  }, [isValidForPull, onRateLimit, query.data, query.isError]);

  return isValidForPull ? query.data : undefined;
}

function getRateLimits(environment: Environment, registryId: RegistryId) {
  if (isLocalEnvironment(environment)) {
    return getLocalEnvironmentRateLimits(environment.Id, registryId);
  }

  const envType = getEnvType(environment.Type);

  return getAgentEnvironmentRateLimits(environment.Id, envType, registryId);
}

async function getLocalEnvironmentRateLimits(
  environmentId: Environment['Id'],
  registryId: RegistryId
) {
  try {
    const { data } = await axios.get<PullRateLimits>(
      buildUrl(environmentId, `dockerhub/${registryId}`)
    );
    return data;
  } catch (e) {
    throw parseAxiosError(
      e as Error,
      '无法获取 DockerHub 拉取速率限制'
    );
  }
}

function getEnvType(type: Environment['Type']) {
  switch (type) {
    case EnvironmentType.AgentOnKubernetes:
    case EnvironmentType.EdgeAgentOnKubernetes:
      return 'kubernetes';

    case EnvironmentType.AgentOnDocker:
    case EnvironmentType.EdgeAgentOnDocker:
    default:
      return 'docker';
  }
}

async function getAgentEnvironmentRateLimits(
  environmentId: Environment['Id'],
  envType: 'kubernetes' | 'docker',
  registryId: RegistryId
) {
  try {
    const { data } = await axios.get<PullRateLimits>(
      buildUrl(environmentId, `${envType}/v2/dockerhub/${registryId}`)
    );
    return data;
  } catch (e) {
    throw parseAxiosError(
      e as Error,
      '无法获取 DockerHub 拉取速率限制'
    );
  }
}
