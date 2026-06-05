import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="row">
      <div className="col-sm-12">
        <InformationPanel title="信息">
          <TextTip>
            {isAdmin ? (
              <span>
                没有可用于管理的环境。请前往{' '}
                <Link
                  to="portainer.wizard.endpoints"
                  data-cy="wizard-add-environments-link"
                >
                  环境向导
                </Link>{' '}
                添加环境。
              </span>
            ) : (
              <span>
                您没有访问任何环境的权限。请联系您的
                管理员。
              </span>
            )}
          </TextTip>
        </InformationPanel>
      </div>
    </div>
  );
}
