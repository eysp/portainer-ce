import { Layers } from 'lucide-react';
import { useCurrentStateAndParams } from '@uirouter/react';

import { WidgetTitle, WidgetBody, Widget } from '@@/Widget';

export function NamespaceDetailsWidget() {
  const {
    params: { id: namespaceName },
  } = useCurrentStateAndParams();
  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget aria-label="命名空间详情">
          <WidgetTitle icon={Layers} title="命名空间" />
          <WidgetBody>
            <table className="table">
              <tbody>
                <tr>
                  <td>名称</td>
                  <td>{namespaceName}</td>
                </tr>
              </tbody>
            </table>
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
