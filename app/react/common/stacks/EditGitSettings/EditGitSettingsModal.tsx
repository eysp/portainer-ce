import { useState } from 'react';
import { Formik } from 'formik';

import { Stack, StackType } from '@/react/common/stacks/types';
import { toGitFormModel } from '@/react/portainer/gitops/types';
import { parseAutoUpdateResponse } from '@/react/portainer/gitops/AutoUpdateFieldset/utils';
import { createWebhookId } from '@/portainer/helpers/webhookHelper';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';

import { useUpdateGitStack } from './useUpdateGitStack';
import { FormValues } from './types';
import { InnerForm } from './InnerForm';
import { useValidationSchema } from './validation';

interface Props {
  onClose: () => void;
  stack: Stack;
}

export function EditGitSettingsModal({ stack, onClose }: Props) {
  const validationSchema = useValidationSchema(stack.Type);
  const [webhookId] = useState(
    () => stack.AutoUpdate?.Webhook || createWebhookId()
  );

  const mutation = useUpdateGitStack(stack);

  const gitModel = toGitFormModel(
    stack.GitSourceId,
    {
      ReferenceName: stack.GitConfig?.ReferenceName ?? '',
      ConfigFilePath: stack.GitConfig?.ConfigFilePath ?? '',
    },
    parseAutoUpdateResponse(stack.AutoUpdate)
  );

  const initialValues: FormValues = {
    kube: { name: stack.Name },
    git: {
      ...gitModel,
      AdditionalFiles: stack.AdditionalFiles || [],
      SourceId: stack.GitSourceId,
    },
    env: stack.Env || [],
    prune: stack.Option?.Prune || false,
    redeployNow: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <InnerForm
        stackName={stack.Name}
        stackType={stack.Type}
        webhookId={webhookId}
        onDismiss={onClose}
        isSubmitting={mutation.isLoading}
      />
    </Formik>
  );

  async function handleSubmit(values: FormValues) {
    let repullImageAndRedeploy: boolean | undefined;
    if (values.redeployNow) {
      const result = await confirmStackUpdate(
        '在 Portainer 本地对此堆栈或应用所做的任何更改都将被覆盖，这可能会导致服务中断。您要继续吗？',
        stack.Type === StackType.DockerSwarm
      );
      if (!result) {
        return;
      }
      repullImageAndRedeploy = result.repullImageAndRedeploy;
    }

    mutation.mutate(
      {
        values,
        repullImageAndRedeploy,
        webhookId,
      },
      {
        onSuccess({ redeployAttempted, redeployFailed, redeployError }) {
          if (redeployFailed) {
            notifyError(
              '失败',
              redeployError,
              '堆栈设置已保存，但重新部署失败'
            );
          } else if (redeployAttempted) {
            notifySuccess('成功', '堆栈部署成功');
          } else {
            notifySuccess('成功', '堆栈设置保存成功');
          }
          onClose();
        },
      }
    );
  }
}
