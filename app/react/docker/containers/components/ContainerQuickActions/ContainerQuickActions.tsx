import clsx from 'clsx';

import { ContainerStatus } from '@/react/docker/containers/types';
import { Authorized } from '@/portainer/hooks/useUser';

import { Icon } from '@@/Icon';
import { Link } from '@@/Link';

import styles from './ContainerQuickActions.module.css';

interface QuickActionsState {
  showQuickActionAttach: boolean;
  showQuickActionExec: boolean;
  showQuickActionInspect: boolean;
  showQuickActionLogs: boolean;
  showQuickActionStats: boolean;
}

interface Props {
  taskId?: string;
  containerId?: string;
  nodeName: string;
  state: QuickActionsState;
  status: ContainerStatus;
}

export function ContainerQuickActions({
  taskId,
  containerId,
  nodeName,
  state,
  status,
}: Props) {
  if (taskId) {
    return <TaskQuickActions taskId={taskId} state={state} />;
  }

  const isActive = [
    ContainerStatus.Starting,
    ContainerStatus.Running,
    ContainerStatus.Healthy,
    ContainerStatus.Unhealthy,
  ].includes(status);

  return (
    <div className={clsx('space-x-1', styles.root)}>
      {state.showQuickActionLogs && (
        <Authorized authorizations="DockerContainerLogs">
          <Link
            to="docker.containers.container.logs"
            params={{ id: containerId, nodeName }}
            title="日志"
          >
            <Icon icon="file-text" feather className="space-right" />
          </Link>
        </Authorized>
      )}

      {state.showQuickActionInspect && (
        <Authorized authorizations="DockerContainerInspect">
          <Link
            to="docker.containers.container.inspect"
            params={{ id: containerId, nodeName }}
            title="检查"
          >
            <Icon icon="info" feather className="space-right" />
          </Link>
        </Authorized>
      )}

      {state.showQuickActionStats && isActive && (
        <Authorized authorizations="DockerContainerStats">
          <Link
            to="docker.containers.container.stats"
            params={{ id: containerId, nodeName }}
            title="状态"
          >
            <Icon icon="bar-chart" feather className="space-right" />
          </Link>
        </Authorized>
      )}

      {state.showQuickActionExec && isActive && (
        <Authorized authorizations="DockerExecStart">
          <Link
            to="docker.containers.container.exec"
            params={{ id: containerId, nodeName }}
            title="执行控制台"
          >
            <Icon icon="terminal" feather className="space-right" />
          </Link>
        </Authorized>
      )}

      {state.showQuickActionAttach && isActive && (
        <Authorized authorizations="DockerContainerAttach">
          <Link
            to="docker.containers.container.attach"
            params={{ id: containerId, nodeName }}
            title="附加控制台"
          >
            <Icon icon="paperclip" feather className="space-right" />
          </Link>
        </Authorized>
      )}
    </div>
  );
}

interface TaskProps {
  taskId: string;
  state: QuickActionsState;
}

function TaskQuickActions({ taskId, state }: TaskProps) {
  return (
    <div className={clsx('space-x-1', styles.root)}>
      {state.showQuickActionLogs && (
        <Authorized authorizations="DockerTaskLogs">
          <Link
            to="docker.tasks.task.logs"
            params={{ id: taskId }}
            title="日志"
          >
            <Icon icon="file-text" feather className="space-right" />
          </Link>
        </Authorized>
      )}

      {state.showQuickActionInspect && (
        <Authorized authorizations="DockerTaskInspect">
          <Link to="docker.tasks.task" params={{ id: taskId }} title="Inspect">
            <Icon icon="info" feather className="space-right" />
          </Link>
        </Authorized>
      )}
    </div>
  );
}
