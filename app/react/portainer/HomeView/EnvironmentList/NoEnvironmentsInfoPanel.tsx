import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="row">
      <div className="col-sm-12">
        <InformationPanel title="提示信息">
          <TextTip>
            {isAdmin ? (
              <span>
                暂无可管理的环境。请前往{' '}
                <Link
                  to="portainer.wizard.endpoints"
                  data-cy="wizard-add-environments-link"
                >
                  环境添加向导
                </Link>{' '}
                以添加新环境。
              </span>
            ) : (
              <span>
                您当前无权访问任何环境，请联系系统管理员。
              </span>
            )}
          </TextTip>
        </InformationPanel>
      </div>
    </div>
  );
}
