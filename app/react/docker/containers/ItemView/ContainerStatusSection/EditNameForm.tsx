import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { trimContainerName } from '@/docker/filters/utils';
import { notifySuccess } from '@/portainer/services/notifications';

import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { ContainerId } from '../../types';
import { useRenameContainer } from '../../queries/useRenameContainer';

interface FormValues {
  name: string;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('容器名称为必填项')
    .min(1, '容器名称不能为空'),
});

export function EditNameForm({
  name,
  onCancel,
  containerId,
  environmentId,
  nodeName,
  onSuccess,
}: {
  name: string;
  onCancel(): void;
  onSuccess(): void;
  containerId: ContainerId;
  environmentId: EnvironmentId;
  nodeName: string | undefined;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const renameMutation = useRenameContainer();

  const initialValues: FormValues = {
    name: trimContainerName(name),
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            name="name"
            className="form-control form-control-sm containerNameInput"
            value={values.name}
            onChange={handleChange}
            data-cy="containerNameInput"
            aria-label="容器名称"
          />
          <Button
            size="xsmall"
            color="none"
            className="!p-0 hover:no-underline"
            onClick={() => onCancel()}
            type="button"
            data-cy="container-cancel-rename-button"
            title="取消"
            aria-label="取消编辑容器名称"
          >
            <Icon icon={X} className="lucide" />
          </Button>
          <Button
            size="xsmall"
            color="none"
            className="!p-0 hover:no-underline"
            type="submit"
            data-cy="container-confirm-rename-button"
            disabled={isSubmitting}
            title="重命名"
            aria-label="重命名容器"
          >
            <Icon icon={Check} className="lucide" />
          </Button>
        </Form>
      )}
    </Formik>
  );

  function handleSubmit(values: FormValues) {
    if (values.name === trimContainerName(name)) {
      onCancel();
      return;
    }

    renameMutation.mutate(
      {
        containerId,
        environmentId,
        name: values.name,
        nodeName,
      },
      {
        onSuccess(_, variables) {
          notifySuccess(
            '成功',
            `容器已成功重命名为 ${variables.name}`
          );
          onSuccess();
        },
      }
    );
  }
}
