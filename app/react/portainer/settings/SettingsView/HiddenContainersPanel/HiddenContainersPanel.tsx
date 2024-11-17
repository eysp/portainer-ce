import { Box } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';

import { TextTip } from '@@/Tip/TextTip';
import { Widget } from '@@/Widget';

import { useSettings, useUpdateSettingsMutation } from '../../queries';
import { Pair } from '../../types';

import { AddLabelForm } from './AddLabelForm';
import { HiddenContainersTable } from './HiddenContainersTable';

export function HiddenContainersPanel() {
  const settingsQuery = useSettings((settings) => settings.BlackListedLabels);
  const mutation = useUpdateSettingsMutation();

  if (!settingsQuery.data) {
    return null;
  }

  const labels = settingsQuery.data;
  return (
    <Widget>
      <Widget.Title icon={Box} title="隐藏容器" />
      <Widget.Body>
        <div className="mb-3">
          <TextTip color="blue">
            您可以从 Portainer UI 中隐藏具有特定标签的容器。您需要指定标签名称和值。
          </TextTip>
        </div>

        <AddLabelForm
          isLoading={mutation.isLoading}
          onSubmit={(name, value) => handleSubmit([...labels, { name, value }])}
        />

        <HiddenContainersTable
          labels={labels}
          isLoading={mutation.isLoading}
          onDelete={(name) =>
            handleSubmit(labels.filter((label) => label.name !== name))
          }
        />
      </Widget.Body>
    </Widget>
  );

  function handleSubmit(labels: Pair[]) {
    mutation.mutate(
      {
        BlackListedLabels: labels,
      },
      {
        onSuccess: () => {
          notifySuccess('成功', '隐藏容器设置已更新');
        },
      }
    );
  }
}
