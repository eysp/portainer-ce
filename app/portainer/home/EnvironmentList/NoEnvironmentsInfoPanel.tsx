import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  return (
    <InformationPanel title="Information">
      <TextTip>
        {isAdmin ? (
          <span>
            没有可供管理的环境。请前往{' '}
            <Link to="portainer.wizard.endpoints">环境向导</Link> to
            添加一个环境。
          </span>
        ) : (
          <span>
            你没有机会进入任何环境。请联系你的
            管理员。
          </span>
        )}
      </TextTip>
    </InformationPanel>
  );
}
