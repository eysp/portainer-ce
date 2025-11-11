import { Laptop } from 'lucide-react';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';

import { useSettings } from '../../queries';

import { AutoEnvCreationSettingsForm } from './AutoEnvCreationSettingsForm';

export function AutomaticEdgeEnvCreation() {
  const settingsQuery = useSettings();

  if (!settingsQuery.data) {
    return null;
  }

  const settings = settingsQuery.data;

  return (
    <Widget>
      <WidgetTitle icon={Laptop} title="自动创建 Edge 环境" />
      <WidgetBody>
        <AutoEnvCreationSettingsForm settings={settings} />
      </WidgetBody>
    </Widget>
  );
}
