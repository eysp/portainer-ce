import { Download } from 'lucide-react';
import { Formik, Form } from 'formik';

import { notifySuccess } from '@/portainer/services/notifications';

import { LoadingButton } from '@@/buttons/LoadingButton';

import { DownloadBackupPayload } from './queries/useDownloadBackupMutation';
import { useDownloadBackupMutation } from './queries';
import { validationSchema } from './BackupFileForm.validation';
import { SecurityFieldset } from './SecurityFieldset';
import { BackupFileSettings } from './types';

export function BackupFileForm() {
  const downloadMutate = useDownloadBackupMutation();

  const settings: BackupFileSettings = {
    password: '',
    passwordProtect: false,
  };

  return (
    <Formik<BackupFileSettings>
      initialValues={settings}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount
    >
      {({ isSubmitting, isValid }) => (
        <Form className="form-horizontal">
          <SecurityFieldset
            switchDataCy="settings-passwordProtectLocal"
            inputDataCy="settings-backupLocalPassword"
          />
  
          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                loadingText="正在下载设置..."
                isLoading={isSubmitting}
                disabled={!isValid}
                className="!ml-0"
                icon={Download}
              >
                下载备份
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  async function onSubmit(values: BackupFileSettings) {
    const payload: DownloadBackupPayload = {
      password: '',
    };
    if (values.passwordProtect) {
      payload.password = values.password;
    }

    downloadMutate.mutate(payload, {
      onSuccess() {
        notifySuccess('成功', '成功下载备份');
      },
    });
  }
}
