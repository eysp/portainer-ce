import { useState } from 'react';

import { CopyButton } from '@@/buttons/CopyButton';
import { Code } from '@@/Code';
import { NavTabs } from '@@/NavTabs';
import { NavContainer } from '@@/NavTabs/NavContainer';
import { TextTip } from '@@/Tip/TextTip';

const deployments = [
  {
    id: 'linux',
    label: 'Linux（CentOS）',
    command: `sudo systemctl enable --now podman.socket`,
  },
];

export function DeploymentScripts() {
  const [deployType, setDeployType] = useState(deployments[0].id);

  const options = deployments.map((c) => ({
    id: c.id,
    label: c.label,
    children: <DeployCode code={c.command} />,
  }));

  return (
    <NavContainer>
      <NavTabs
        options={options}
        onSelect={(id: string) => setDeployType(id)}
        selectedId={deployType}
      />
    </NavContainer>
  );
}

interface DeployCodeProps {
  code: string;
}

function DeployCode({ code }: DeployCodeProps) {
  const bindMountCode = `-v "/run/podman/podman.sock:/var/run/docker.sock"`;
  return (
    <>
      <TextTip color="blue" className="mb-1">
        使用 Socket 时，请确保启动 Portainer 容器时带上以下 Podman 参数：
      </TextTip>
      <Code>{bindMountCode}</Code>
      <div className="mt-2 mb-4">
        <CopyButton copyText={bindMountCode} data-cy="copy-deployment-command">
          复制命令
        </CopyButton>
      </div>

      <TextTip color="blue" className="mb-1">
        要使用 Socket，请确保已启动 Podman 的 rootful（特权）Socket：
      </TextTip>
      <Code>{code}</Code>
      <div className="mt-2">
        <CopyButton copyText={code} data-cy="copy-deployment-command">
          复制命令
        </CopyButton>
      </div>
    </>
  );
}
