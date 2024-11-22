import _ from 'lodash';
import {
  AlertTriangle,
  CheckCircle,
  type Icon as IconType,
  Loader2,
  XCircle,
  MinusCircle,
} from 'lucide-react';

import { useEnvironmentList } from '@/react/portainer/environments/queries';
import { isVersionSmaller } from '@/react/common/semver-utils';

import { Icon, IconMode } from '@@/Icon';
import { Tooltip } from '@@/Tip/Tooltip';

import { DeploymentStatus, EdgeStack, StatusType } from '../../types';

export function EdgeStackStatus({ edgeStack }: { edgeStack: EdgeStack }) {
  const status = Object.values(edgeStack.Status);
  const lastStatus = _.compact(status.map((s) => _.last(s.Status)));

  const environmentsQuery = useEnvironmentList({ edgeStackId: edgeStack.Id });

  if (environmentsQuery.isLoading) {
    return null;
  }

  const hasOldVersion = environmentsQuery.environments.some((env) =>
    isVersionSmaller(env.Agent.Version, '2.19.0')
  );

  const { icon, label, mode, spin, tooltip } = getStatus(
    edgeStack.NumDeployments,
    lastStatus,
    hasOldVersion
  );

  return (
    <div className="mx-auto inline-flex items-center gap-2">
      {icon && <Icon icon={icon} spin={spin} mode={mode} />}
      {label}
      {tooltip && <Tooltip message={tooltip} />}
    </div>
  );
}

function getStatus(
  numDeployments: number,
  envStatus: Array<DeploymentStatus>,
  hasOldVersion: boolean
): {
  label: string;
  icon?: IconType;
  spin?: boolean;
  mode?: IconMode;
  tooltip?: string;
} {
  if (!numDeployments || hasOldVersion) {
    return {
      label: '不可用',
      icon: MinusCircle,
      mode: 'secondary',
      tooltip: getUnavailableTooltip(),
    };
  }

  if (envStatus.length < numDeployments) {
    return {
      label: '部署中',
      icon: Loader2,
      spin: true,
      mode: 'primary',
    };
  }

  const allFailed = envStatus.every((s) => s.Type === StatusType.Error);

  if (allFailed) {
    return {
      label: '失败',
      icon: XCircle,
      mode: 'danger',
    };
  }

  const allCompleted = envStatus.every((s) => s.Type === StatusType.Completed);

  if (allCompleted) {
    return {
      label: '已完成',
      icon: CheckCircle,
      mode: 'success',
    };
  }

  const allRunning = envStatus.every(
    (s) =>
      s.Type === StatusType.Running ||
      (s.Type === StatusType.DeploymentReceived && hasOldVersion)
  );

  if (allRunning) {
    return {
      label: '运行中',
      icon: CheckCircle,
      mode: 'success',
    };
  }

  const hasDeploying = envStatus.some((s) => s.Type === StatusType.Deploying);
  const hasRunning = envStatus.some((s) => s.Type === StatusType.Running);
  const hasFailed = envStatus.some((s) => s.Type === StatusType.Error);

  if (hasRunning && hasFailed && !hasDeploying) {
    return {
      label: '部分运行中',
      icon: AlertTriangle,
      mode: 'warning',
    };
  }

  return {
    label: '部署中',
    icon: Loader2,
    spin: true,
    mode: 'primary',
  };

  function getUnavailableTooltip() {
    if (!numDeployments) {
      return '由于您的边缘组中没有可用环境，您的边缘堆栈当前不可用';
    }

    if (hasOldVersion) {
      return '请注意，边缘堆栈的新状态功能仅适用于 Edge Agent 版本 2.19.0 及以上版本。要访问边缘堆栈的状态，必须将 Edge Agent 升级到与您的 Portainer 服务器兼容的相应版本。';
    }

    return '';
  }
}
