import { Form, Formik } from 'formik';
import { useReducer } from 'react';
import { Laptop } from 'lucide-react';

import { EdgeCheckinIntervalField } from '@/react/edge/components/EdgeCheckInIntervalField';
import { EdgeAsyncIntervalsForm } from '@/react/edge/components/EdgeAsyncIntervalsForm';
import { notifySuccess } from '@/portainer/services/notifications';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { FormSection } from '@@/form-components/FormSection';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

import { useSettings, useUpdateSettingsMutation } from '../../queries';

import { FormValues } from './types';

const asyncIntervalFieldSettings = {
  ping: {
    label: '边缘代理默认ping频率',
    tooltip:
      '每个边缘代理用于ping Portainer实例的默认间隔。影响边缘环境管理和边缘计算功能。',
  },
  snapshot: {
    label: '边缘代理默认快照频率',
    tooltip:
      '每个边缘代理用于快照代理状态的默认间隔。',
  },
  command: {
    label: '边缘代理默认命令频率',
    tooltip: '每个边缘代理用于执行命令的默认间隔。',
  },
};

export function DeploymentSyncOptions() {
  const settingsQuery = useSettings();
  const settingsMutation = useUpdateSettingsMutation();
  const [formKey, resetForm] = useReducer((state) => state + 1, 0);

  if (!settingsQuery.data) {
    return null;
  }

  const initialValues: FormValues = {
    Edge: {
      CommandInterval: settingsQuery.data.Edge.CommandInterval,
      PingInterval: settingsQuery.data.Edge.PingInterval,
      SnapshotInterval: settingsQuery.data.Edge.SnapshotInterval,
    },
    EdgeAgentCheckinInterval: settingsQuery.data.EdgeAgentCheckinInterval,
  };

  return (
    <div className="row">
      <Widget>
        <WidgetTitle icon={Laptop} title="部署同步选项" />
        <WidgetBody>
          <Formik<FormValues>
            initialValues={initialValues}
            onSubmit={handleSubmit}
            key={formKey}
          >
            {({ setFieldValue, values, isValid, dirty }) => (
              <Form className="form-horizontal">
                <TextTip color="blue">
                  在此设置的默认值将作为边缘环境创建时的选项可供选择
                </TextTip>

                <FormSection title="签到间隔">
                  <EdgeCheckinIntervalField
                    value={values.EdgeAgentCheckinInterval}
                    onChange={(value) =>
                      setFieldValue('EdgeAgentCheckinInterval', value)
                    }
                    isDefaultHidden
                    label="边缘代理默认轮询频率"
                    tooltip="每个边缘代理用于与Portainer实例签到的默认间隔。影响边缘环境管理和边缘计算功能。"
                  />
                </FormSection>

                {isBE && (
                  <FormSection title="异步签到间隔">
                    <EdgeAsyncIntervalsForm
                      values={values.Edge}
                      onChange={(value) => setFieldValue('Edge', value)}
                      isDefaultHidden
                      fieldSettings={asyncIntervalFieldSettings}
                    />
                  </FormSection>
                )}

                <div className="form-group mt-5">
                  <div className="col-sm-12">
                    <LoadingButton
                      disabled={!isValid || !dirty}
                      className="!ml-0"
                      data-cy="settings-deploySyncOptionsButton"
                      isLoading={settingsMutation.isLoading}
                      loadingText="正在保存设置..."
                    >
                      保存设置
                    </LoadingButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </WidgetBody>
      </Widget>
    </div>
  );

  function handleSubmit(values: FormValues) {
    settingsMutation.mutate(
      {
        Edge: values.Edge,
        EdgeAgentCheckinInterval: values.EdgeAgentCheckinInterval,
      },
      {
        onSuccess() {
          notifySuccess('成功', '设置更新成功');
          resetForm();
        },
      }
    );
  }
}
