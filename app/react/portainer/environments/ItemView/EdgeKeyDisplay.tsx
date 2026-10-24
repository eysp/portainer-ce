import { CopyButton } from '@@/buttons';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { Code } from '@@/Code';

export function EdgeKeyDisplay({ edgeKey }: { edgeKey: string }) {
  return (
    <FormSection title="加入令牌 (Join token)">
      <TextTip color="blue">
        对于预配置边缘 Agent 的场景，请使用以下加入令牌将边缘 Agent 关联到此环境。
      </TextTip>

      <p className="small text-muted mt-2">
        您可以在{' '}
        <a href="https://docs.portainer.io/advanced/how-to-prestage-an-edge-agent-environment">此处</a>
        的用户指南中了解更多有关预配置的信息。
      </p>

      <Code>{edgeKey}</Code>

      <CopyButton
        copyText={edgeKey}
        className="mt-2"
        data-cy="copy-edge-key-button"
      >
        复制令牌
      </CopyButton>
    </FormSection>
  );
}
