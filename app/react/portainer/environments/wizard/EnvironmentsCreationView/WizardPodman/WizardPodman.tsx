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

import { AnalyticsStateKey } from '../types';
import { EdgeAgentTab } from '../shared/EdgeAgentTab';

import { AgentTab } from './AgentTab';
import { SocketTab } from './SocketTab';

interface Props {
  onCreate(environment: Environment, analytics: AnalyticsStateKey): void;
}

const options: BoxSelectorOption<
  'agent' | 'api' | 'socket' | 'edgeAgentStandard' | 'edgeAgentAsync'
>[] = _.compact([
  {
    id: 'agent',
    icon: <BadgeIcon icon={Zap} size="3xl" />,
    label: 'Agent',
    description: '',
    value: 'agent',
  },
  {
    id: 'socket',
    icon: <BadgeIcon icon={Plug2} size="3xl" />,
    label: 'Socket',
    description: '',
    value: 'socket',
  },
  {
    id: 'edgeAgentStandard',
    icon: <BadgeIcon icon={EdgeAgentStandardIcon} size="3xl" />,
    label: '边缘代理标准模式',
    description: '',
    value: 'edgeAgentStandard',
  },
  isBE && {
    id: 'edgeAgentAsync',
    icon: <BadgeIcon icon={EdgeAgentAsyncIcon} size="3xl" />,
    label: '边缘代理异步模式',
    description: '',
    value: 'edgeAgentAsync',
  },
]);

const containerEngine = ContainerEngine.Podman;

export function WizardPodman({ onCreate }: Props) {
  const [creationType, setCreationType] = useState(options[0].value);

  const tab = getTab(creationType);

  return (
    <div className="form-horizontal">
      <BoxSelector
        onChange={(v) => setCreationType(v)}
        options={options}
        value={creationType}
        radioName="creation-type"
      />
      <TextTip color="orange" className="mb-2" inline={false}>
        当前，Portainer 仅支持在 <b>CentOS 9</b> Linux 环境中以 root 模式（特权模式）运行的 <b>Podman 5</b>。
        无 root 权限的模式（rootless）和其他 Linux 发行版可能可用，但尚未获得官方支持。
      </TextTip>
      {tab}
    </div>
  );

  function getTab(
    creationType:
      | 'agent'
      | 'api'
      | 'socket'
      | 'edgeAgentStandard'
      | 'edgeAgentAsync'
  ) {
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
