import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Laptop } from 'lucide-react';

import { generateKey } from '@/react/portainer/environments/environment.service/edge';
import { EdgeScriptForm } from '@/react/edge/components/EdgeScriptForm';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { useSettings } from '@/react/portainer/settings/queries';
import EdgeAgentStandardIcon from '@/react/edge/components/edge-agent-standard.svg?c';
import EdgeAgentAsyncIcon from '@/react/edge/components/edge-agent-async.svg?c';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';
import { BoxSelector } from '@@/BoxSelector';
import { FormSection } from '@@/form-components/FormSection';
import { CopyButton } from '@@/buttons';
import { Link } from '@@/Link';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

const commands = {
  linux: [
    commandsTabs.k8sLinux,
    commandsTabs.swarmLinux,
    commandsTabs.standaloneLinux,
  ],
  win: [commandsTabs.swarmWindows, commandsTabs.standaloneWindow],
};

const asyncModeOptions = [
  {
    icon: EdgeAgentStandardIcon,
    id: 'standard',
    label: 'Edge Agent 标准模式',
    value: false,
    iconType: 'badge',
  },
  {
    icon: EdgeAgentAsyncIcon,
    id: 'async',
    label: 'Edge Agent 异步模式',
    value: true,
    iconType: 'badge',
  },
] as const;

export function AutomaticEdgeEnvCreation() {
  const edgeKeyMutation = useGenerateKeyMutation();
  const { mutate: generateKey, reset: resetKey } = edgeKeyMutation;
  const settingsQuery = useSettings();
  const [asyncMode, setAsyncMode] = useState(false);

  const url = settingsQuery.data?.EdgePortainerUrl;

  const settings = settingsQuery.data;
  const edgeKey = edgeKeyMutation.data;
  const edgeComputeConfigurationOK = validateConfiguration();

  useEffect(() => {
    if (edgeComputeConfigurationOK) {
      generateKey();
    } else {
      resetKey();
    }
  }, [generateKey, edgeComputeConfigurationOK, resetKey]);

  if (!settingsQuery.data) {
    return null;
  }

  return (
    <Widget>
      <WidgetTitle icon={Laptop} title="自动创建 Edge 环境" />
      <WidgetBody className="form-horizontal">
        {!edgeComputeConfigurationOK ? (
          <TextTip color="orange">
            要使用此功能，请先启用 Edge 计算特性，点击
            <Link
              to="portainer.settings.edgeCompute"
              data-cy="edge-disabled-portainer-edge-settings-link"
            >
              此处
            </Link>
            ，并正确配置 Portainer API 服务器 URL 和隧道服务器地址。
          </TextTip>
        ) : (
          <>
            <BoxSelector
              slim
              radioName="async-mode-selector"
              value={asyncMode}
              onChange={handleChangeAsyncMode}
              options={asyncModeOptions}
            />

            <EdgeKeyInfo
              asyncMode={asyncMode}
              edgeKey={edgeKey}
              isLoading={edgeKeyMutation.isLoading}
              url={url}
              tunnelUrl={settings?.Edge.TunnelServerAddress}
            />
          </>
        )}
      </WidgetBody>
    </Widget>
  );

  function handleChangeAsyncMode(asyncMode: boolean) {
    setAsyncMode(asyncMode);
  }

  function validateConfiguration() {
    return !!(
      settings &&
      settings.EnableEdgeComputeFeatures &&
      settings.EdgePortainerUrl &&
      settings.Edge.TunnelServerAddress
    );
  }
}

// using mutation because we want this action to run only when required
function useGenerateKeyMutation() {
  return useMutation(generateKey);
}

function EdgeKeyInfo({
  isLoading,
  edgeKey,
  url,
  tunnelUrl,
  asyncMode,
}: {
  isLoading: boolean;
  edgeKey?: string;
  url?: string;
  tunnelUrl?: string;
  asyncMode: boolean;
}) {
  if (isLoading || !edgeKey) {
    return <div>正在为 {url} 生成密钥…</div>;
  }

  return (
    <>
      <hr />

      <FormSection title="Edge 密钥">
        <div className="break-words">
          <code>{edgeKey}</code>
        </div>

        <CopyButton
          copyText={edgeKey}
          data-cy="edge-auto-create-copy-token-button"
        >
          复制令牌
        </CopyButton>
      </FormSection>

      <hr />

      <EdgeScriptForm
        edgeInfo={{ key: edgeKey }}
        commands={commands}
        asyncMode={asyncMode}
        showMetaFields
      >
        <FormControl label="Portainer API 服务器 URL">
          <Input value={url} readOnly data-cy="edge-auto-create-url-input" />
        </FormControl>

        {!asyncMode && (
          <FormControl label="Portainer 隧道服务器地址">
            <Input
              value={tunnelUrl}
              readOnly
              data-cy="edge-auto-create-tunnel-address-input"
            />
          </FormControl>
        )}

        <TextTip color="blue">
          Portainer 服务器 URL
          {!asyncMode ? ' 与隧道服务器地址已配置在' : ' 已配置在'}
          <Link
            to="portainer.settings.edgeCompute"
            data-cy="server-url-portainer-edge-settings-link"
          >
            此处
          </Link>
        </TextTip>
      </EdgeScriptForm>
    </>
  );
}
