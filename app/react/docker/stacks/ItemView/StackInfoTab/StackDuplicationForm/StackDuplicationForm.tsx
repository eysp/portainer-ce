import { Formik } from 'formik';
import { Copy } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { Stack } from '@/react/common/stacks/types';

import { Widget } from '@@/Widget';
import { WidgetBody } from '@@/Widget/WidgetBody';
import { WidgetTitle } from '@@/Widget/WidgetTitle';
import { validateForm } from '@@/form-components/validate-form';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

import { FormSubmitValues } from './StackDuplicationForm.types';
import { StackDuplicationFormInner } from './StackDuplicationFormInner';
import {
  getBaseValidationSchema,
  getDuplicateValidationSchema,
  getMigrateValidationSchema,
} from './StackDuplicationForm.validation';
import { useDuplicateStackMutation } from './useDuplicateStackMutation';
import { useMigrateStackMutation } from './useMigrateStackMutation';

interface StackDuplicationFormProps {
  currentEnvironmentId: number;

  yamlError?: string;

  originalFileContent: string;
  stack: Stack;
}

export function StackDuplicationForm({
  yamlError,
  originalFileContent,
  currentEnvironmentId,
  stack,
}: StackDuplicationFormProps) {
  const router = useRouter();
  const duplicateMutation = useDuplicateStackMutation();
  const migrateMutation = useMigrateStackMutation();
  const initialValues: FormSubmitValues = {
    environmentId: undefined,
    newName: '',
    actionType: 'migrate', // Default value, will be set by button clicks
  };

  return (
    <Widget>
      <WidgetTitle title="堆栈复制 / 迁移" icon={Copy} />
      <WidgetBody>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validateOnMount
          validationSchema={getBaseValidationSchema()}
        >
          <StackDuplicationFormInner
            yamlError={yamlError}
            currentEnvironmentId={currentEnvironmentId}
            currentStackName={stack.Name}
            isLoading={migrateMutation.isLoading || duplicateMutation.isLoading}
          />
        </Formik>
      </WidgetBody>
    </Widget>
  );

  async function handleSubmit(values: FormSubmitValues) {
    const { actionType, environmentId, newName } = values;

    switch (actionType) {
      case 'duplicate':
        await handleDuplicate(environmentId!, newName);
        break;
      case 'migrate':
        await handleMigrate(environmentId!, newName);
        break;
      default:
        break;
    }
  }

  async function handleDuplicate(environmentId: number, name: string) {
    const schema = getDuplicateValidationSchema();
    const errors = await validateForm(() => schema, { environmentId, name });
    if (errors) {
      notifyError(
        '验证错误',
        undefined,
        '请修复错误后重试。'
      );
      return;
    }

    duplicateMutation.mutate(
      {
        fileContent: originalFileContent,
        name,
        type: stack.Type,
        env: stack.Env,
        targetEnvironmentId: environmentId,
      },
      {
        onSuccess() {
          notifySuccess('成功', '堆栈复制成功');
          router.stateService.go('docker.stacks', {}, { reload: true });
        },
        onError(error) {
          notifyError('失败', error as Error, '无法复制堆栈');
        },
      }
    );
  }

  async function handleMigrate(
    environmentId: number,
    name: string | undefined
  ) {
    const isRename = environmentId === currentEnvironmentId;

    const confirmed = await confirm({
      title: '您确定吗？',
      modalType: ModalType.Warn,
      message: isRename
        ? 'This action will deploy a new instance of this stack with the new name that will replace the current stack. Please note that this does NOT migrate the content of any persistent volumes that may be attached to this stack.'
        : 'This action will deploy a new instance of this stack on the target environment, please note that this does NOT relocate the content of any persistent volumes that may be attached to this stack.',
      confirmButton: buildConfirmButton(
        isRename ? 'Rename' : 'Migrate',
        'danger'
      ),
    });

    if (!confirmed) {
      return;
    }

    const schema = getMigrateValidationSchema(stack.Name, currentEnvironmentId);
    const errors = await validateForm(() => schema, {
      environmentId,
      name,
    });

    if (errors) {
      notifyError(
        'Validation Error',
        undefined,
        'Please fix the errors and try again.'
      );
      return;
    }

    migrateMutation.mutate(
      {
        name,
        stackType: stack.Type,
        fromEnvId: currentEnvironmentId,
        id: stack.Id,
        targetEnvId: environmentId,
        fromSwarmId: stack.SwarmId,
      },
      {
        onSuccess() {
          notifySuccess('堆栈迁移成功', name || stack.Name);
          router.stateService.go('docker.stacks', {}, { reload: true });
        },
        onError(error) {
          notifyError('失败', error as Error, '无法迁移堆栈');
        },
      }
    );
  }
}
