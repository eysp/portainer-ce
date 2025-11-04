import { Form, Formik } from 'formik';

import { useCurrentUser } from '@/react/hooks/useUser';
import { notifySuccess } from '@/portainer/services/notifications';
import { updateAxiosAdapter } from '@/portainer/services/axios';
import { withError } from '@/react-tools/react-query';

import { TextTip } from '@@/Tip/TextTip';
import { LoadingButton } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

import { useUpdateUserMutation } from '../../useUpdateUserMutation';

type FormValues = {
  useCache: boolean;
};

export function ApplicationSettingsForm() {
  const { user } = useCurrentUser();
  const updateSettingsMutation = useUpdateUserMutation();

  const initialValues = {
    useCache: user.UseCache,
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
    >
      {({ isValid, dirty, values, setFieldValue }) => (
        <Form className="form-horizontal">
          <TextTip color="orange" className="mb-3">
            启用前端数据缓存可能意味着其他用户或在 Portainer 外部对 Kubernetes 集群所做的更改可能需要最多五分钟才能显示在您的会话中。此缓存仅适用于 Kubernetes 环境。
          </TextTip>
          <SwitchField
            label="为 Kubernetes 环境启用前端数据缓存"
            data-cy="account-applicationSettingsUseCacheSwitch"
            checked={values.useCache}
            onChange={(value) => setFieldValue('useCache', value)}
            labelClass="col-lg-2 col-sm-3" // match the label width of the other fields in the page
            fieldClass="!mb-4"
          />
          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="保存中..."
                isLoading={updateSettingsMutation.isLoading}
                disabled={!isValid || !dirty}
                className="!ml-0"
                data-cy="account-applicationSettingsSaveButton"
              >
                保存
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  function handleSubmit(values: FormValues) {
    updateSettingsMutation.mutate(
      {
        Id: user.Id,
        UseCache: values.useCache,
      },
      {
        onSuccess() {
          updateAxiosAdapter(values.useCache);
          notifySuccess(
            '成功',
            '应用程序设置已成功更新。'
          );
          // a full reload is required to update the angular $http cache setting
          setTimeout(() => window.location.reload(), 2000); // allow 2s to show the success notification
        },
        ...withError('无法更新应用程序设置'),
      }
    );
  }
}
