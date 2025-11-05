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
                没有可用的环境进行管理。请前往{' '}
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
                您无权访问任何环境。请联系您的管理员。
              </span>
            )}
          </TextTip>
        </InformationPanel>
      </div>
    </div>
  );
}
