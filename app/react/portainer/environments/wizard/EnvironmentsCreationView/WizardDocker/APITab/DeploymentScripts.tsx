import { useState } from 'react';

import { CopyButton } from '@@/buttons/CopyButton';
import { Code } from '@@/Code';
import { NavTabs } from '@@/NavTabs';
import { NavContainer } from '@@/NavTabs/NavContainer';
import { TextTip } from '@@/Tip/TextTip';

const deployments = [
  {
    id: 'linux',
    label: 'Linux',
    command: `-v "/var/run/docker.sock:/var/run/docker.sock"`,
  },
  {
    id: 'win',
    label: 'Windows',
    command: '-v \\.\\pipe\\docker_engine:\\.\\pipe\\docker_engine',
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
  return (
    <>
      <TextTip color="blue" className="mb-1">
        当使用 Socket 时，请确保你在启动 Portainer 容器时添加了以下 Docker 参数：
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
