import { Settings } from 'lucide-react';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';

import { ApplicationSettingsForm } from './ApplicationSettingsForm';

export function ApplicationSettingsWidget() {
  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetTitle icon={Settings} title="应用设置" />
          <WidgetBody>
            <ApplicationSettingsForm />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
