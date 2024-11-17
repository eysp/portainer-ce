import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useCallback } from 'react';
import { FlaskConical } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { ExperimentalFeatures } from '@/react/portainer/settings/types';
import { useUpdateExperimentalSettingsMutation } from '@/react/portainer/settings/queries';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

import { EnableOpenAIIntegrationSwitch } from './EnableOpenAIIntegrationSwitch';

interface FormValues {
  OpenAIIntegration: boolean;
}
const validation = yup.object({
  OpenAIIntegration: yup.boolean(),
});

interface Props {
  settings: ExperimentalFeatures;
}

export function ExperimentalFeaturesSettingsForm({ settings }: Props) {
  const initialValues: FormValues = settings;

  const mutation = useUpdateExperimentalSettingsMutation();

  const { mutate: updateSettings } = mutation;

  const handleSubmit = useCallback(
    (variables: FormValues) => {
      updateSettings(
        {
          OpenAIIntegration: variables.OpenAIIntegration,
        },
        {
          onSuccess() {
            notifySuccess(
              '成功',
              '实验特性设置已成功更新'
            );
          },
        }
      );
    },
    [updateSettings]
  );

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className="form-horizontal">
          <TextTip color="blue" icon={FlaskConical}>
            实验特性可能会在没有通知的情况下停止支持。
          </TextTip>

          <br />
          <br />

          <div className="form-group col-sm-12 text-muted small">
            在 Portainer 版本中，我们可能会推出一些正在实验中的特性。这些特性处于开发的早期阶段，经过有限的测试。
            <br />
            我们的目标是收集早期用户反馈，以便我们能够改进、增强，并最终使我们的特性达到最佳状态。禁用实验性特性将会阻止访问该特性。
          </div>

          <EnableOpenAIIntegrationSwitch />

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="正在保存设置..."
                isLoading={mutation.isLoading}
                disabled={!isValid || !dirty}
                className="!ml-0"
                data-cy="settings-experimentalButton"
              >
                保存实验性设置
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
