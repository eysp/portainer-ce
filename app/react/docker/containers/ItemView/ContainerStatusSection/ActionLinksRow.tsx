import { FileText, Info, BarChart2, Terminal, Paperclip } from 'lucide-react';

import { ContainerId } from '@/react/docker/containers/types';
import { useAuthorizations } from '@/react/hooks/useUser';

import { Icon } from '@@/Icon';
import { Button, ButtonGroup } from '@@/buttons';
import { Link } from '@@/Link';

interface Props {
  containerId: ContainerId;
}

export function ActionLinksRow({ containerId }: Props) {
  const { authorized: canLogs } = useAuthorizations(['DockerContainerLogs']);
  const { authorized: canInspect } = useAuthorizations([
    'DockerContainerInspect',
  ]);
  const { authorized: canStats } = useAuthorizations(['DockerContainerStats']);
  const { authorized: canExec } = useAuthorizations(['DockerExecStart']);
  const { authorized: canAttach } = useAuthorizations([
    'DockerContainerAttach',
  ]);

  const hasAnyAuthorization =
    canLogs || canInspect || canStats || canExec || canAttach;

  if (!hasAnyAuthorization) {
    return null;
  }

  return (
    <tr>
      <td colSpan={2}>
        <ButtonGroup>
          {canLogs && (
            <Button
              as={Link}
              props={{
                to: 'docker.containers.container.logs',
                params: {
                  id: containerId,
                },
              }}
              data-cy="container-logs-link"
              color="link"
            >
              <Icon icon={FileText} className="lucide space-right" />
              日志
            </Button>
          )}
          {canInspect && (
            <Button
              as={Link}
              props={{
                to: 'docker.containers.container.inspect',
                params: {
                  id: containerId,
                },
              }}
              data-cy="container-inspect-link"
              color="link"
            >
              <Icon icon={Info} className="lucide space-right" />
              检查
            </Button>
          )}
          {canStats && (
            <Button
              as={Link}
              props={{
                to: 'docker.containers.container.stats',
                params: {
                  id: containerId,
                },
              }}
              data-cy="container-stats-link"
              color="link"
            >
              <Icon icon={BarChart2} className="lucide space-right" />
              统计信息
            </Button>
          )}
          {canExec && (
            <Button
              as={Link}
              props={{
                to: 'docker.containers.container.exec',
                params: {
                  id: containerId,
                },
              }}
              data-cy="container-console-link"
              color="link"
            >
              <Icon icon={Terminal} className="lucide space-right" />
              控制台
            </Button>
          )}
          {canAttach && (
            <Button
              as={Link}
              props={{
                to: 'docker.containers.container.attach',
                params: {
                  id: containerId,
                },
              }}
              data-cy="container-attach-link"
              color="link"
            >
              <Icon icon={Paperclip} className="lucide space-right" />
              附加
            </Button>
          )}
        </ButtonGroup>
      </td>
    </tr>
  );
}
