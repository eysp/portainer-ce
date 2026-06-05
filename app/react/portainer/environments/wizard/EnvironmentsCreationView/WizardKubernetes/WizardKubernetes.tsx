import { useState } from 'react';
import { Zap, UploadCloud } from 'lucide-react';
import _ from 'lodash';

import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import EdgeAgentStandardIcon from '@/react/edge/components/edge-agent-standard.svg?c';
import EdgeAgentAsyncIcon from '@/react/edge/components/edge-agent-async.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector/types';
import { BoxSelector } from '@@/BoxSelector';
import { BEOverlay } from '@@/BEFeatureIndicator/BEOverlay';
import { FormSection } from '@@/form-components/FormSection';
import { Badge } from '@@/Badge';
import { ExternalLink } from '@@/ExternalLink';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { AnalyticsStateKey } from '../types';
import { EdgeAgentTab } from '../shared/EdgeAgentTab';

import { AgentPanel } from './AgentPanel';
import { KubeConfigTeaserForm } from './KubeConfigTeaserForm';

interface Props {
  onCreate(environment: Environment, analytics: AnalyticsStateKey): void;
}

type CreationType =
  | 'edgeAgentStandard'
  | 'edgeAgentAsync'
  | 'agent'
  | 'kubeconfig';

const primaryOptions: BoxSelectorOption<CreationType>[] = _.compact([
  {
    id: 'edgeAgentStandard',
    icon: EdgeAgentStandardIcon,
    iconType: 'badge',
    label: 'Edge Agent 标准版',
    description: (
      <>
        <span>
          <Badge type="infoSecondary">推荐</Badge>{' '}
          <Badge type="infoSecondary">支持策略</Badge>
        </span>
        <span className="mt-1 block">
          远程环境将发起与 Portainer 服务器的连接，并能够打开安全的按需隧道以进行实时交互。Portainer 服务器必须可以从 Edge Agent 环境访问。
        </span>
      </>
    ),
    value: 'edgeAgentStandard',
  },
  isBE && {
    id: 'edgeAgentAsync',
    icon: EdgeAgentAsyncIcon,
    iconType: 'badge',
    label: 'Edge Agent 异步版',
    description:
      '远程环境将发起与 Portainer 服务器的连接，但无法打开实时隧道。Portainer 服务器必须可以从 Edge Agent 环境访问。',
    value: 'edgeAgentAsync',
  },
]);

const legacyOptions: BoxSelectorOption<CreationType>[] = [
  {
    id: 'agent_endpoint',
    icon: Zap,
    iconType: 'badge',
    label: 'Agent',
    value: 'agent',
    description:
      'Portainer 服务器将发起与远程环境的连接。远程环境上的代理必须可以从 Portainer 服务器环境访问。',
  },
  {
    id: 'kubeconfig_endpoint',
    icon: UploadCloud,
    iconType: 'badge',
    label: 'Import',
    value: 'kubeconfig',
    description: '导入现有的 Kubernetes 配置。',
    feature: FeatureId.K8S_CREATE_FROM_KUBECONFIG,
  },
];

export function WizardKubernetes({ onCreate }: Props) {
  const edgeAgentDocsUrl = useDocsUrl(
    '/faqs/getting-started/why-do-we-recommend-using-the-edge-agent-instead-of-the-traditional-agent'
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
        className="[&>label]:mb-5"
      >
        <p className="text-xs text-muted mb-2">
          这些是不支持边缘功能或策略管理的传统选项。对于大多数用例，{' '}
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

      {tab}
    </div>
  );

  function getTab(type: CreationType) {
    switch (type) {
      case 'agent':
        return (
          <AgentPanel
            onCreate={(environment) => onCreate(environment, 'kubernetesAgent')}
          />
        );
      case 'edgeAgentStandard':
        return (
          <EdgeAgentTab
            onCreate={(environment) =>
              onCreate(environment, 'kubernetesEdgeAgentStandard')
            }
            commands={[{ ...commandsTabs.k8sLinux, label: 'Linux' }]}
            containerEngine={ContainerEngine.Kubernetes}
          />
        );
      case 'edgeAgentAsync':
        return (
          <EdgeAgentTab
            asyncMode
            onCreate={(environment) =>
              onCreate(environment, 'kubernetesEdgeAgentAsync')
            }
            commands={[{ ...commandsTabs.k8sLinux, label: 'Linux' }]}
            containerEngine={ContainerEngine.Kubernetes}
          />
        );
      case 'kubeconfig':
        return (
          <div className="mb-3">
            <BEOverlay featureId={FeatureId.K8S_CREATE_FROM_KUBECONFIG}>
              <KubeConfigTeaserForm />
            </BEOverlay>
          </div>
        );
      default:
        throw new Error('不支持此创建类型');
    }
  }
}
