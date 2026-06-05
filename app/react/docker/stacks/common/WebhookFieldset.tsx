import { useState } from 'react';

import { baseStackWebhookUrl } from '@/portainer/helpers/webhookHelper';
import { Authorized, useAuthorizations } from '@/react/hooks/useUser';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { WebhookSettings } from '@/react/portainer/gitops/AutoUpdateFieldset/WebhookSettings';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookFieldset({
  value,
  onChange,
  webhookId,
}: {
  value: boolean;
  onChange(value: boolean): void;
  webhookId: string;
}) {
  const [hasWebhook] = useState(() => value);
  const authQuery = useAuthorizations(
    hasWebhook ? ['PortainerWebhookDelete'] : ['PortainerWebhookCreate']
  );

  return (
    <Authorized
      authorizations={[
        'PortainerWebhookCreate',
        'PortainerWebhookList',
        'PortainerWebhookDelete',
      ]}
      adminOnlyCE
    >
      <AuthorizedWebhook
        value={value}
        onChange={onChange}
        disabled={!authQuery.authorized}
        webhookId={webhookId}
      />
    </Authorized>
  );
}

export function AuthorizedWebhook({
  value,
  onChange,
  disabled,
  webhookId,
}: {
  value: boolean;
  onChange(value: boolean): void;
  disabled?: boolean;
  webhookId: string;
}) {
  return (
    <FormSection title="Webhook">
      <SwitchField
        name="enableWebhook"
        checked={value}
        onChange={(checked) => onChange(checked)}
        labelClass="col-sm-2"
        tooltip="创建一个 webhook（或回调 URI）以自动更新此堆栈。向此回调 URI 发送 POST 请求（无需任何身份验证）将拉取关联镜像的最新版本并重新部署此堆栈。"
        label="创建堆栈 webhook"
        featureId={FeatureId.STACK_WEBHOOK}
        data-cy="stack-webhook-switch"
        disabled={disabled}
      />
      {value && (
        <WebhookSettings baseUrl={baseStackWebhookUrl()} value={webhookId} />
      )}
    </FormSection>
  );
}
