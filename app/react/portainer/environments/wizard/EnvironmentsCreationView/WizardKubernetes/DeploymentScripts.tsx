import { useState } from 'react';
import { Info } from 'lucide-react';

import { getAgentShortVersion } from '@/portainer/views/endpoints/helpers';
import { useAgentDetails } from '@/react/portainer/environments/queries/useAgentDetails';

import { CopyButton } from '@@/buttons/CopyButton';
import { Code } from '@@/Code';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { NavTabs } from '@@/NavTabs';
import { Icon } from '@@/Icon';
import { NavContainer } from '@@/NavTabs/NavContainer';

const deployments = [
  {
    id: 'k8sLoadBalancer',
    label: '通过负载均衡器的 Kubernetes',
    command: kubeLoadBalancerCommand,
    showAgentSecretMessage: true,
  },
  {
    id: 'k8sNodePort',
    label: '通过节点端口的 Kubernetes',
    command: kubeNodePortCommand,
    showAgentSecretMessage: true,
  },
];

export function DeploymentScripts() {
  const [deployType, setDeployType] = useState(deployments[0].id);

  const agentDetailsQuery = useAgentDetails();

  if (!agentDetailsQuery) {
    return null;
  }

  const { agentVersion, agentSecret } = agentDetailsQuery;

  const options = deployments.map((c) => {
    const code = c.command(agentVersion);

    return {
      id: c.id,
      label: c.label,
      children: (
        <DeployCode
          agentSecret={agentSecret}
          showAgentSecretMessage={c.showAgentSecretMessage}
          code={code}
        />
      ),
    };
  });

  return (
    <>
      <FormSectionTitle>Information</FormSectionTitle>

      <div className="form-group">
        <span className="col-sm-12 text-muted small">
          确保您已首先在集群中部署了 Portainer 代理。
          请参阅下面与平台相关的命令进行部署。
        </span>
      </div>

      <NavContainer>
        <NavTabs
          options={options}
          onSelect={(id: string) => setDeployType(id)}
          selectedId={deployType}
        />
      </NavContainer>
    </>
  );
}

function kubeNodePortCommand(agentVersion: string) {
  const agentShortVersion = getAgentShortVersion(agentVersion);

  return `kubectl apply -f https://downloads.portainer.io/ce${agentShortVersion}/portainer-agent-k8s-nodeport.yaml`;
}

function kubeLoadBalancerCommand(agentVersion: string) {
  const agentShortVersion = getAgentShortVersion(agentVersion);

  return `kubectl apply -f https://downloads.portainer.io/ce${agentShortVersion}/portainer-agent-k8s-lb.yaml`;
}

interface LoadBalancerProps {
  agentSecret?: string;
  showAgentSecretMessage?: boolean;
  code: string;
}

function DeployCode({
  agentSecret,
  showAgentSecretMessage,
  code,
}: LoadBalancerProps) {
  return (
    <>
      {showAgentSecretMessage && agentSecret && (
        <p className="text-muted small my-6">
          <Icon icon={Info} mode="primary" className="mr-1" />
          请注意，环境变量 AGENT_SECRET 需要设置为
          <code>{agentSecret}</code>。请更新将从以下脚本下载的清单。
        </p>
      )}
      <Code>{code}</Code>
      <div className="mt-2">
        <CopyButton copyText={code}>复制命令</CopyButton>
      </div>
    </>
  );
}
