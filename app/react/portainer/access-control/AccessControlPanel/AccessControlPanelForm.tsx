import { Form, Formik } from 'formik';
import clsx from 'clsx';
import { useMutation } from 'react-query';
import { object } from 'yup';

import { useCurrentUser, useIsEdgeAdmin } from '@/react/hooks/useUser';
import { notifySuccess } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { confirm } from '@@/modals/confirm';
import { Button } from '@@/buttons';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { buildConfirmButton } from '@@/modals/utils';
import { ModalType } from '@@/modals';

import { EditDetails } from '../EditDetails';
import { parseAccessControlFormData } from '../utils';
import { validationSchema } from '../AccessControlForm/AccessControlForm.validation';
import { applyResourceControlChange } from '../access-control.service';
import {
  ResourceControlType,
  ResourceId,
  AccessControlFormData,
} from '../types';
import { ResourceControlViewModel } from '../models/ResourceControlViewModel';

import styles from './AccessControlPanelForm.module.css';

interface Props {
  resourceType: ResourceControlType;
  resourceId: ResourceId;
  resourceControl?: ResourceControlViewModel;
  environmentId: EnvironmentId;
  onCancelClick(): void;
  onUpdateSuccess(): Promise<void>;
}

export function AccessControlPanelForm({
  resourceId,
  resourceType,
  resourceControl,
  environmentId,
  onCancelClick,
  onUpdateSuccess,
}: Props) {
  const { user } = useCurrentUser();
  const isAdminQuery = useIsEdgeAdmin();

  const updateAccess = useMutation(
    (variables: AccessControlFormData) =>
      applyResourceControlChange(
        resourceType,
        resourceId,
        variables,
        resourceControl
      ),
    {
      meta: {
        error: { title: '失败', message: '无法更新访问控制' },
      },
      onSuccess() {
        return onUpdateSuccess();
      },
    }
  );

  if (isAdminQuery.isLoading) {
    return null;
  }

  const { isAdmin } = isAdminQuery;

  const initialValues = {
    accessControl: parseAccessControlFormData(
      isAdmin,
      user.Id,
      resourceControl
    ),
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validationSchema={() =>
        object({ accessControl: validationSchema(isAdmin) })
      }
    >
      {({ setFieldValue, values, isSubmitting, isValid, errors }) => (
        <Form className={clsx('form-horizontal', styles.form)}>
          <EditDetails
            onChange={(accessControl) =>
              setFieldValue('accessControl', accessControl)
            }
            values={values.accessControl}
            isPublicVisible
            errors={errors.accessControl}
            environmentId={environmentId}
          />

          <div className="form-group">
            <div className="col-sm-12">
              <Button size="small" color="default" onClick={onCancelClick}>
                取消
              </Button>
              <LoadingButton
                size="small"
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid}
                loadingText="更新所有权"
              >
                更新所有权
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  async function handleSubmit({
    accessControl,
  }: {
    accessControl: AccessControlFormData;
  }) {
    const confirmed = await confirmAccessControlUpdate();
    if (!confirmed) {
      return;
    }

    updateAccess.mutate(accessControl, {
      onSuccess() {
        notifySuccess('成功', '访问控制已成功更新');
      },
    });
  }
}

function confirmAccessControlUpdate() {
  return confirm({
    modalType: ModalType.Warn,
    title: '你确定吗？',
    message:
      '更改此资源的所有权可能会限制某些用户的管理。',
    confirmButton: buildConfirmButton('更改所有权'),
  });
}
