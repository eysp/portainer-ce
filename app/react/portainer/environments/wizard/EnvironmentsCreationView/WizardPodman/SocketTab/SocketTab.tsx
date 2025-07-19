import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';

import { TextTip } from '@@/Tip/TextTip';

import { DeploymentScripts } from './DeploymentScripts';
import { SocketForm } from './SocketForm';

interface Props {
  onCreate(environment: Environment): void;
}

export function SocketTab({ onCreate }: Props) {
  return (
    <>
      <TextTip color="orange" className="mb-2" inline={false}>
        若要通过 socket 连接，Portainer 服务器必须运行在 Podman 容器中。
      </TextTip>

      <DeploymentScripts />

      <div className="mt-5">
        <SocketForm
          onCreate={onCreate}
          containerEngine={ContainerEngine.Podman}
        />
      </div>
    </>
  );
}
