import { useState } from 'react';
import { Zap, Network, Plug2 } from 'lucide-react';
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
import { Alert } from '@@/Alert';
import { FormSection } from '@@/form-components/FormSection';
import { Badge } from '@@/Badge';
import { ExternalLink } from '@@/ExternalLink';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { AnalyticsStateKey } from '../types';
import { EdgeAgentTab } from '../shared/EdgeAgentTab';

import { AgentTab } from './AgentTab';
import { APITab } from './APITab';
import { SocketTab } from './SocketTab';

interface Props {
  onCreate(environment: Environment, analytics: AnalyticsStateKey): void;
  isDockerStandalone?: boolean;
}

type CreationType =
  | 'agent'
  | 'api'
  | 'socket'
  | 'edgeAgentStandard'
  | 'edgeAgentAsync';

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
          远程环境将主动向 Portainer 服务端发起连接，并能够按需开启安全隧道以进行实时交互。必须确保从边缘 Agent 环境能够访问 Portainer 服务端。
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
      '远程环境将主动向 Portainer 服务端发起连接，但无法开启实时隧道。必须确保从边缘 Agent 环境能够访问 Portainer 服务端。',
    value: 'edgeAgentAsync' as CreationType,
  },
]);

const legacyOptions: BoxSelectorOption<CreationType>[] = [
  {
    id: 'agent',
    icon: <BadgeIcon icon={Zap} size="3xl" />,
    label: 'Agent',
    description:
      'Portainer 服务端将主动向远程环境发起连接。必须确保从 Portainer 服务端环境能够访问远程环境中的 Agent。',
    value: 'agent',
  },
  {
    id: 'api',
    icon: <BadgeIcon icon={Network} size="3xl" />,
    label: 'API',
    description: '通过 Docker API 直接连接到环境。',
    value: 'api',
  },
  {
    id: 'socket',
    icon: <BadgeIcon icon={Plug2} size="3xl" />,
    label: 'Socket',
    description: '通过 Docker socket 直接连接到环境。',
    value: 'socket',
  },
];

const containerEngine = ContainerEngine.Docker;

export function WizardDocker({ onCreate, isDockerStandalone }: Props) {
  const edgeAgentDocsUrl = useDocsUrl(
    '/faqs/getting-started/why-do-we-recommend-using-the-edge-agent-instead-of-the-traditional-agent'
  );
  const [creationType, setCreationType] = useState<CreationType>(
    primaryOptions[0].value
  );

  const tab = getTab(creationType);

  return (
    <div className="form-horizontal">
      {!isDockerStandalone && (
        <Alert color="warn" className="col-sm-12 mb-2">
          <div>
            对于当前环境只需操作 <b>一次</b>，无论集群中有多少个节点。您 <b>不需要</b> 将每个节点作为单独的环境添加到 Portainer 中。只需添加一个节点（建议添加管理节点/Manager Node）即可让 Portainer 管理整个集群。
          </div>
        </Alert>
      )}
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
          这些是不支持边缘特性或策略管理的传统选项。对于大多数场景，{' '}
          <ExternalLink
            to={edgeAgentDocsUrl}
            data-cy="wizard-edge-agent-docs-link"
          >
            推荐使用边缘 Agent (Edge Agent)
          </ExternalLink>
        </p>
        <BoxSelector
          onChange={(v) => setCreationType(v)}
          options={legacyOptions}
          value={creationType}
          radioName="creation-type"
        />
      </FormSection>

      {tab}
    </div>
  );

  function getTab(creationType: CreationType) {
    switch (creationType) {
      case 'agent':
        return (
          <AgentTab
            onCreate={(environment) => onCreate(environment, 'dockerAgent')}
            isDockerStandalone={isDockerStandalone}
          />
        );
      case 'api':
        return (
          <APITab
            onCreate={(environment) => onCreate(environment, 'dockerApi')}
          />
        );
      case 'socket':
        return (
          <SocketTab
            onCreate={(environment) => onCreate(environment, 'localEndpoint')}
          />
        );
      case 'edgeAgentStandard':
        return (
          <EdgeAgentTab
            onCreate={(environment) =>
              onCreate(environment, 'dockerEdgeAgentStandard')
            }
            commands={{
              linux: isDockerStandalone
                ? [commandsTabs.standaloneLinux]
                : [commandsTabs.swarmLinux],
              win: isDockerStandalone
                ? [commandsTabs.standaloneWindow]
                : [commandsTabs.swarmWindows],
            }}
            containerEngine={containerEngine}
          />
        );
      case 'edgeAgentAsync':
        return (
          <EdgeAgentTab
            asyncMode
            onCreate={(environment) =>
              onCreate(environment, 'dockerEdgeAgentAsync')
            }
            commands={{
              linux: isDockerStandalone
                ? [commandsTabs.standaloneLinux]
                : [commandsTabs.swarmLinux],
              win: isDockerStandalone
                ? [commandsTabs.standaloneWindow]
                : [commandsTabs.swarmWindows],
            }}
            containerEngine={containerEngine}
          />
        );
      default:
        return null;
    }
  }
}
