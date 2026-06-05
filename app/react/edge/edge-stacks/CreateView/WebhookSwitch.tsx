import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="form-section-title"> Webhooks </div>
      <SwitchField
        label="创建 Edge 堆栈 Webhook"
        checked={value}
        onChange={onChange}
        tooltip="创建一个 Webhook（回调地址）以自动更新该堆栈。向该回调地址发送 POST 请求（无需认证）将会拉取最新镜像并重新部署堆栈。"
        labelClass="col-sm-3 col-lg-2"
        data-cy="webhook-switch"
      />

      {value && (
        <TextTip>
          Sending environment variables to the webhook is updating the stack
          with the new values. New variables names will be added to the stack
          and existing variables will be updated.
        </TextTip>
      )}
    </div>
  );
}
