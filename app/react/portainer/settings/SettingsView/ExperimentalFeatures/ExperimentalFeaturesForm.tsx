import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useCallback } from 'react';
import { FlaskConical } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { ExperimentalFeatures } from '@/react/portainer/settings/types';
import { useUpdateExperimentalSettingsMutation } from '@/react/portainer/settings/queries';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

interface FormValues {}

const validation = yup.object({});

interface Props {
  settings: ExperimentalFeatures;
}

export function ExperimentalFeaturesSettingsForm({ settings }: Props) {
  const initialValues: FormValues = settings;

  const mutation = useUpdateExperimentalSettingsMutation();

  const { mutate: updateSettings } = mutation;

  const handleSubmit = useCallback(() => {
    updateSettings(
      {},
      {
        onSuccess() {
          notifySuccess(
            '成功',
            '实验功能设置已更新'
          );
        },
      }
    );
  }, [updateSettings]);

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
            实验功能可能会在不另行通知的情况下停止提供。
          </TextTip>

          <br />
          <br />

          <div className="form-group col-sm-12 text-muted small">
            在 Portainer 版本中，我们可能会引入仍处于实验阶段的功能。
            这些功能处于早期开发阶段，测试有限。
            <br />
            我们的目标是获得早期用户反馈，以便改进和增强功能。
            禁用实验功能将阻止访问该功能。
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="正在保存设置..."
                isLoading={mutation.isLoading}
                disabled={!isValid || !dirty}
                className="!ml-0"
                data-cy="settings-experimentalButton"
              >
                保存实验功能设置
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
