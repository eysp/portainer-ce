import { useState } from 'react';

import { useAgentDetails } from '@/react/portainer/environments/queries/useAgentDetails';

import { Code } from '@@/Code';
import { CopyButton } from '@@/buttons/CopyButton';
import { Modal } from '@@/modals/Modal';
import { Button } from '@@/buttons';
import { NavTabs } from '@@/NavTabs';
import { NavContainer } from '@@/NavTabs/NavContainer';
import { SwitchField } from '@@/form-components/SwitchField';

export type ConnectivityEnvironment = 'docker' | 'podman' | 'kubernetes';

const ALL_ENVIRONMENTS: ConnectivityEnvironment[] = [
  'docker',
  'podman',
  'kubernetes',
];

const ENVIRONMENT_LABELS: Record<ConnectivityEnvironment, string> = {
  docker: 'Docker',
  podman: 'Podman',
  kubernetes: 'Kubernetes',
};

interface Props {
  onDismiss: () => void;
  portainerUrl: string;
  tunnelServerAddr?: string;
  /** When provided, show only this environment. When omitted, show tabs for all environments. */
  environment?: ConnectivityEnvironment;
}

export function ConnectivityTestModal({
  onDismiss,
  portainerUrl,
  tunnelServerAddr,
  environment,
}: Props) {
  const environments = environment ? [environment] : ALL_ENVIRONMENTS;
  const [selectedTab, setSelectedTab] = useState<ConnectivityEnvironment>(
    environments[0]
  );
  const [insecurePoll, setInsecurePoll] = useState(true);
  const agentDetails = useAgentDetails();
  const agentVersion = agentDetails?.agentVersion ?? 'latest';

  const options = environments.map((env) => {
    const command = buildCommand(
      env,
      portainerUrl,
      tunnelServerAddr,
      insecurePoll,
      agentVersion
    );
    const label = ENVIRONMENT_LABELS[env];
    return {
      id: env,
      label,
      children: (
        <>
          <Code>{command}</Code>
          <div className="mt-2">
            <CopyButton
              copyText={command}
              data-cy="copy-connectivity-test-command-button"
            >
              复制代码
            </CopyButton>
          </div>
        </>
      ),
    };
  });

  return (
    <Modal onDismiss={onDismiss} aria-label="Test connectivity" size="lg">
      <Modal.Header title="测试连通性" />
      <Modal.Body>
        <p className="mb-4">
          在将部署 Edge Agent 的环境中运行此命令，以验证其是否可以连接到 Portainer 服务器。每个目标地址在探测前都会被显示，探测完成后会输出结果。对于无法连通的主机，命令可能需要长达 30 秒超时才能结束，请耐心等待。
        </p>
        <div className="mb-4">
          <SwitchField
            checked={insecurePoll}
            onChange={setInsecurePoll}
            label="允许自签名证书"
            labelClass="col-sm-4 col-lg-3"
            tooltip="在脚本中包含 EDGE_INSECURE_POLL=1。如果您的 Portainer 实例使用自签名或不受信任的证书，请启用此选项。"
            data-cy="connectivity-insecure-poll-switch"
          />
        </div>
        <NavContainer>
          <NavTabs
            selectedId={selectedTab}
            options={options}
            onSelect={(id: ConnectivityEnvironment) => setSelectedTab(id)}
          />
        </NavContainer>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onDismiss}
          color="default"
          data-cy="close-connectivity-test-modal-button"
        >
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function buildCommand(
  environment: ConnectivityEnvironment,
  portainerUrl: string,
  tunnelServerAddr?: string,
  allowInsecurePoll?: boolean,
  agentVersion = 'latest'
): string {
  const envVars = [
    'EDGE_CONNECTIVITY_CHECK=1',
    `EDGE_CONNECTIVITY_CHECK_URL=${portainerUrl}`,
    `EDGE_INSECURE_POLL=${allowInsecurePoll ? '1' : '0'}`,
    ...(tunnelServerAddr
      ? [`EDGE_CONNECTIVITY_CHECK_TUNNEL_ADDR=${tunnelServerAddr}`]
      : []),
  ];

  const image = `portainer/agent:${agentVersion}`;

  switch (environment) {
    case 'kubernetes':
      return [
        `kubectl run portainer-connectivity-check \\`,
        `  --rm --attach --restart=Never \\`,
        `  --image=${image} \\`,
        ...envVars.map((v, i) =>
          i < envVars.length - 1 ? `  --env="${v}" \\` : `  --env="${v}"`
        ),
      ].join('\n');
    case 'podman':
      return [
        `sudo podman run --rm \\`,
        ...envVars.map((v) => `  -e ${v} \\`),
        `  docker.io/${image}`,
      ].join('\n');
    case 'docker':
    default:
      return [
        `docker run --rm \\`,
        ...envVars.map((v) => `  -e ${v} \\`),
        `  ${image}`,
      ].join('\n');
  }
}
