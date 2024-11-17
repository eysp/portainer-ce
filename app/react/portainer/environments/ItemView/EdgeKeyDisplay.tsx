import { CopyButton } from '@@/buttons';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { Code } from '@@/Code';

export function EdgeKeyDisplay({ edgeKey }: { edgeKey: string }) {
  return (
    <FormSection title="加入令牌">
      <TextTip color="blue">
        对于预配置边缘代理的用户，请使用以下加入令牌将边缘代理与此环境关联。
      </TextTip>

      <p className="small text-muted mt-2">
        您可以在用户指南中了解更多有关预配置的信息，用户指南可以{' '}
        <a href="https://downloads.portainer.io/edge_agent_guide.pdf">在此查看</a>。
      </p>

      <Code>{edgeKey}</Code>

      <CopyButton copyText={edgeKey} className="mt-2">
        复制令牌
      </CopyButton>
    </FormSection>
  );
}
