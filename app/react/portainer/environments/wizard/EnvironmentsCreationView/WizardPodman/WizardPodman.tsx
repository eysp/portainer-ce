import { useState } from 'react';
import { Zap, Plug2 } from 'lucide-react';
import _ from 'lodash';

import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import EdgeAgentStandardIcon from '@/react/edge/components/edge-agent-standard.svg?c';
import EdgeAgentAsyncIcon from '@/react/edge/components/edge-agent-async.svg?c';

import { BoxSelector, type BoxSelectorOption } from '@@/BoxSelector';
import { BadgeIcon } from '@@/BadgeIcon';
import { TextTip } from '@@/Tip/TextTip';
import { FormSection } from '@@/form-components/FormSection';
import { Badge } from '@@/Badge';
import { ExternalLink } from '@@/ExternalLink';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { AnalyticsStateKey } from '../types';
import { EdgeAgentTab } from '../shared/EdgeAgentTab';

import { AgentTab } from './AgentTab';
import { SocketTab } from './SocketTab';

interface Props {
  onCreate(environment: Environment, analytics: AnalyticsStateKey): void;
}

type CreationType = 'agent' | 'socket' | 'edgeAgentStandard' | 'edgeAgentAsync';

const primaryOptions: BoxSelectorOption<CreationType>[] = _.compact([
  {
    id: 'edgeAgentStandard',
    icon: <BadgeIcon icon={EdgeAgentStandardIcon} size="3xl" />,
    label: 'Edge Agent Standard',
    description: (
      <>
        <span>
          <Badge type="infoSecondary">推荐</Badge>{' '}
          <Badge type="infoSecondary">支持策略</Badge>
        </span>
        <span className="mt-1 block">
          远程环境将主动连接到 Portainer 服务器，能够建立安全按需隧道以实现实时交互。Portainer 服务器必须可以从 Edge Agent 环境中访问。
        </span>
      </>
    ),
    value: 'edgeAgentStandard',
  },
  isBE && {
    id: 'edgeAgentAsync',
    icon: <BadgeIcon icon={EdgeAgentAsyncIcon} size="3xl" />,
    label: 'Edge Agent Async',
    description:
      '远程环境将主动连接到 Portainer 服务器，不支持建立实时隧道。Portainer 服务器必须可以从 Edge Agent 环境中访问。',
    value: 'edgeAgentAsync',
  },
]);

const legacyOptions: BoxSelectorOption<CreationType>[] = [
  {
    id: 'agent',
    icon: <BadgeIcon icon={Zap} size="3xl" />,
    label: 'Agent',
    description:
      'Portainer 服务器将主动连接到远程环境。Portainer 服务器环境必须可以访问远程环境上的 Agent。',
    value: 'agent',
  },
  {
    id: 'socket',
    icon: <BadgeIcon icon={Plug2} size="3xl" />,
    label: 'Socket',
    description: '通过 Docker Socket 直接连接到环境。',
    value: 'socket',
  },
];

const containerEngine = ContainerEngine.Podman;

export function WizardPodman({ onCreate }: Props) {
  const edgeAgentDocsUrl = useDocsUrl(
    '/faqs/getting-started/why-do-we-recommend-using-the-edge-agent-instead-of-the-traditional-agent'
  );
  const podmanSupportDocsUrl = useDocsUrl(
    '/faqs/installing/does-portainer-support-podman'
  );
  const [creationType, setCreationType] = useState<CreationType>(
    primaryOptions[0].value
  );

  const tab = getTab(creationType);

  return (
    <div className="form-horizontal">
      <BoxSelector
        onChange={(v) => setCreationType(v)}
        options={primaryOptions}
        value={creationType}
        radioName="creation-type"
        className="!-mb-2"
      />

      <FormSection
        key="legacy-options"
        title="更多选项"
        titleSize="sm"
        isFoldable
        defaultFolded={false}
        className="mb-8"
      >
        <p className="text-muted mb-2 text-xs">
          这些是传统选项，不支持边缘特性或策略管理。对于大多数用例，{' '}
          <ExternalLink
            to={edgeAgentDocsUrl}
            data-cy="wizard-edge-agent-docs-link"
          >
            推荐使用 Edge Agent
          </ExternalLink>
        </p>
        <BoxSelector
          onChange={(v) => setCreationType(v)}
          options={legacyOptions}
          value={creationType}
          radioName="creation-type"
        />
      </FormSection>

      <TextTip color="orange" className="mb-2" inline={false}>
        Portainer 通过 Podman 的{' '}
        <b>Docker 兼容 API</b> 连接到 Podman，并且仅支持在 <b>CentOS 9</b> Linux 环境中以 rootful (特权) 模式运行的 <b>Podman 5</b>。
        Rootless 模式和其他 Linux 发行版可能可以工作，但不受官方支持。{' '}
        <ExternalLink
          to={podmanSupportDocsUrl}
          data-cy="wizard-podman-support-docs-link"
        >
          支持的 Podman 配置
        </ExternalLink>
      </TextTip>
      {tab}
    </div>
  );

  function getTab(creationType: CreationType) {
    switch (creationType) {
      case 'agent':
        return (
          <AgentTab
            onCreate={(environment) => onCreate(environment, 'podmanAgent')}
          />
        );
      case 'socket':
        return (
          <SocketTab
            onCreate={(environment) =>
              onCreate(environment, 'podmanLocalEnvironment')
            }
          />
        );
      case 'edgeAgentStandard':
        return (
          <EdgeAgentTab
            onCreate={(environment) =>
              onCreate(environment, 'podmanEdgeAgentStandard')
            }
            commands={[commandsTabs.podmanLinux]}
            containerEngine={containerEngine}
          />
        );
      case 'edgeAgentAsync':
        return (
          <EdgeAgentTab
            asyncMode
            onCreate={(environment) =>
              onCreate(environment, 'podmanEdgeAgentAsync')
            }
            commands={[commandsTabs.podmanLinux]}
            containerEngine={containerEngine}
          />
        );
      default:
        return null;
    }
  }
}
