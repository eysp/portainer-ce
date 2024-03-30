import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  return (
    <InformationPanel title="信息">
  <TextTip>
    {isAdmin ? (
      <span>
        无环境可用于管理。请前往<Link to="portainer.wizard.endpoints">环境向导</Link>添加一个环境。
      </span>
    ) : (
      <span>
        您没有访问任何环境的权限。请联系您的管理员。
      </span>
    )}
  </TextTip>
</InformationPanel>
  );
}
