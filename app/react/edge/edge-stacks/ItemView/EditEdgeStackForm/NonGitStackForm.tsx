import { Form, Formik, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import { array, boolean, number, object, SchemaOf, string } from 'yup';
import { useRouter } from '@uirouter/react';
import _ from 'lodash';

import { EdgeGroupsSelector } from '@/react/edge/edge-stacks/components/EdgeGroupsSelector';
import { EdgeStackDeploymentTypeSelector } from '@/react/edge/edge-stacks/components/EdgeStackDeploymentTypeSelector';
import {
  DeploymentType,
  EdgeStack,
  StaggerOption,
} from '@/react/edge/edge-stacks/types';
import { EnvironmentType } from '@/react/portainer/environments/types';
import { WebhookSettings } from '@/react/portainer/gitops/AutoUpdateFieldset/WebhookSettings';
import {
  baseEdgeStackWebhookUrl,
  createWebhookId,
} from '@/portainer/helpers/webhookHelper';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import { notifySuccess } from '@/portainer/services/notifications';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';
import { LoadingButton } from '@@/buttons';
import { FormError } from '@@/form-components/FormError';
import {
  EnvironmentVariablesPanel,
  envVarValidation,
} from '@@/form-components/EnvironmentVariablesFieldset';
import { usePreventExit } from '@@/WebEditorForm';

import {
  getEdgeStackFile,
  useEdgeStackFile,
} from '../../queries/useEdgeStackFile';
import {
  StaggerFieldset,
  staggerConfigValidation,
} from '../../components/StaggerFieldset';
import { RetryDeployToggle } from '../../components/RetryDeployToggle';
import { PrePullToggle } from '../../components/PrePullToggle';
import { getDefaultStaggerConfig } from '../../components/StaggerFieldset.types';

import { PrivateRegistryFieldsetWrapper } from './PrivateRegistryFieldsetWrapper';
import { FormValues } from './types';
import { useEdgeGroupHasType } from './useEdgeGroupHasType';
import { useStaggerUpdateStatus } from './useStaggerUpdateStatus';
import { useUpdateEdgeStackMutation } from './useUpdateEdgeStackMutation';
import { ComposeForm } from './ComposeForm';
import { KubernetesForm } from './KubernetesForm';
import { useAllowKubeToSelectCompose } from './useAllowKubeToSelectCompose';

const forms = {
  [DeploymentType.Compose]: ComposeForm,
  [DeploymentType.Kubernetes]: KubernetesForm,
};

export function NonGitStackForm({ edgeStack }: { edgeStack: EdgeStack }) {
  const mutation = useUpdateEdgeStackMutation();
  const fileQuery = useEdgeStackFile(edgeStack.Id, { skipErrors: true });
  const allowKubeToSelectCompose = useAllowKubeToSelectCompose(edgeStack);
  const router = useRouter();

  if (!fileQuery.isSuccess) {
    return null;
  }

  const fileContent = fileQuery.data || '';

  const formValues: FormValues = {
    edgeGroups: edgeStack.EdgeGroups,
    deploymentType: edgeStack.DeploymentType,
    privateRegistryId: edgeStack.Registries?.[0],
    content: fileContent,
    useManifestNamespaces: edgeStack.UseManifestNamespaces,
    prePullImage: edgeStack.PrePullImage,
    retryDeploy: edgeStack.RetryDeploy,
    webhookEnabled: !!edgeStack.Webhook,
    envVars: edgeStack.EnvVars || [],
    rollbackTo: undefined,
    staggerConfig: edgeStack.StaggerConfig || getDefaultStaggerConfig(),
  };

  const versionOptions = getVersions(edgeStack);

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validationSchema={formValidation()}
    >
      <InnerForm
        edgeStack={edgeStack}
        isLoading={mutation.isLoading}
        allowKubeToSelectCompose={allowKubeToSelectCompose}
        versionOptions={versionOptions}
        isSaved={mutation.isSuccess}
      />
    </Formik>
  );

  async function handleSubmit(values: FormValues) {
    let rePullImage = false;
    if (isBE && values.deploymentType === DeploymentType.Compose) {
      const defaultToggle = values.prePullImage;
      const result = await confirmStackUpdate(
        '是否要强制更新该堆栈？',
        defaultToggle
      );
      if (!result) {
        return;
      }

      rePullImage = result.pullImage;
    }

    const updateVersion = !!(
      fileContent !== values.content ||
      values.privateRegistryId !== edgeStack.Registries[0] ||
      values.useManifestNamespaces !== edgeStack.UseManifestNamespaces ||
      values.prePullImage !== edgeStack.PrePullImage ||
      values.retryDeploy !== edgeStack.RetryDeploy ||
      !edgeStack.EnvVars ||
      _.differenceWith(values.envVars, edgeStack.EnvVars, _.isEqual).length >
        0 ||
      rePullImage
    );

    mutation.mutate(
      {
        id: edgeStack.Id,
        stackFileContent: values.content,
        edgeGroups: values.edgeGroups,
        deploymentType: values.deploymentType,
        registries: values.privateRegistryId ? [values.privateRegistryId] : [],
        useManifestNamespaces: values.useManifestNamespaces,
        prePullImage: values.prePullImage,
        rePullImage,
        retryDeploy: values.retryDeploy,
        updateVersion,
        webhook: values.webhookEnabled
          ? edgeStack.Webhook || createWebhookId()
          : '',
        envVars: values.envVars,
        rollbackTo: values.rollbackTo,
        staggerConfig: values.staggerConfig,
      },
      {
        onSuccess: () => {
          notifySuccess('成功', '堆栈已成功部署');
          router.stateService.go('^');
        },
      }
    );
  }
}
function getVersions(edgeStack: EdgeStack): Array<number> | undefined {
  if (!isBE) {
    return undefined;
  }

  return _.compact([
    edgeStack.StackFileVersion,
    edgeStack.PreviousDeploymentInfo?.FileVersion,
  ]);
}

function InnerForm({
  edgeStack,
  isLoading,
  allowKubeToSelectCompose,
  versionOptions,
  isSaved,
}: {
  edgeStack: EdgeStack;
  isLoading: boolean;
  allowKubeToSelectCompose: boolean;
  versionOptions: number[] | undefined;
  isSaved: boolean;
}) {
  const {
    values,
    setFieldValue,
    isValid,
    errors,
    setValues,
    setFieldError,
    initialValues,
  } = useFormikContext<FormValues>();

  usePreventExit(initialValues.content, values.content, !isSaved);

  const { getCachedContent, setContentCache } = useCachedContent();
  const { hasType } = useEdgeGroupHasType(values.edgeGroups);
  const staggerUpdateStatus = useStaggerUpdateStatus(edgeStack.Id);
  const [selectedVersion, setSelectedVersion] = useState(versionOptions?.[0]);
  const selectedParallelOption =
    values.staggerConfig.StaggerOption === StaggerOption.Parallel;

  useEffect(() => {
    if (versionOptions && selectedVersion !== versionOptions[0]) {
      setFieldValue('rollbackTo', selectedVersion);
    } else {
      setFieldValue('rollbackTo', undefined);
    }
  }, [selectedVersion, setFieldValue, versionOptions]);

  const hasKubeEndpoint = hasType(EnvironmentType.EdgeAgentOnKubernetes);
  const hasDockerEndpoint = hasType(EnvironmentType.EdgeAgentOnDocker);

  if (isBE && !staggerUpdateStatus.isSuccess) {
    return null;
  }

  const staggerUpdating =
    staggerUpdateStatus.data === 'updating' && selectedParallelOption;

  const DeploymentForm = forms[values.deploymentType];

  return (
    <Form className="form-horizontal">
      <EdgeGroupsSelector
        value={values.edgeGroups}
        onChange={(value) => setFieldValue('edgeGroups', value)}
        error={errors.edgeGroups}
      />

      {hasKubeEndpoint && hasDockerEndpoint && (
        <TextTip>
          当选择的 Edge 组中包含多种环境类型（例如同时包含 Kubernetes 与 Docker 环境）时，无法选择部署类型。请仅选择包含同一类型环境的 Edge 组。
        </TextTip>
      )}

      {values.deploymentType === DeploymentType.Compose && hasKubeEndpoint && (
        <FormError>
          包含 Kubernetes 环境的 Edge 组不再支持 Compose 部署类型。若需使用 Compose，请仅选择包含 Docker 环境的 Edge 组。
        </FormError>
      )}

      <EdgeStackDeploymentTypeSelector
        allowKubeToSelectCompose={allowKubeToSelectCompose}
        value={values.deploymentType}
        hasDockerEndpoint={hasType(EnvironmentType.EdgeAgentOnDocker)}
        hasKubeEndpoint={hasType(EnvironmentType.EdgeAgentOnKubernetes)}
        onChange={(value) => {
          setFieldValue('content', getCachedContent(value));
          setFieldValue('deploymentType', value);
        }}
      />

      <DeploymentForm
        hasKubeEndpoint={hasType(EnvironmentType.EdgeAgentOnKubernetes)}
        handleContentChange={handleContentChange}
        versionOptions={versionOptions}
        handleVersionChange={handleVersionChange}
      />

      {isBE && (
        <>
          <FormSection title="Webhooks">
            <div className="form-group">
              <div className="col-sm-12">
                <SwitchField
                  label="创建 Edge 堆栈 Webhook"
                  data-cy="edge-stack-enable-webhook-switch"
                  checked={values.webhookEnabled}
                  labelClass="col-sm-3 col-lg-2"
                  onChange={(value) => setFieldValue('webhookEnabled', value)}
                  tooltip="创建一个 Webhook（回调地址）以自动更新该堆栈。向该回调地址发送 POST 请求（无需认证）将会拉取最新镜像并重新部署堆栈。"
                />
              </div>
            </div>

            {edgeStack.Webhook && (
              <>
                <WebhookSettings
                  baseUrl={baseEdgeStackWebhookUrl()}
                  value={edgeStack.Webhook}
                  docsLink=""
                />

                <TextTip color="orange">
                  通过 Webhook 发送环境变量将使用新值更新该堆栈。新的变量名会被添加到堆栈中，已有变量会被更新。
                </TextTip>
              </>
            )}
          </FormSection>

          <PrivateRegistryFieldsetWrapper
            value={values.privateRegistryId}
            onChange={(value) => setFieldValue('privateRegistryId', value)}
            values={{
              fileContent: values.content,
            }}
            onFieldError={(error) => setFieldError('privateRegistryId', error)}
            error={errors.privateRegistryId}
          />

          {values.deploymentType === DeploymentType.Compose && (
            <>
              <EnvironmentVariablesPanel
                onChange={(value) => setFieldValue('envVars', value)}
                values={values.envVars}
                errors={errors.envVars}
              />

              <PrePullToggle
                onChange={(value) => setFieldValue('prePullImage', value)}
                value={values.prePullImage}
              />

              <RetryDeployToggle
                onChange={(value) => setFieldValue('retryDeploy', value)}
                value={values.retryDeploy}
              />
            </>
          )}

          <StaggerFieldset
            values={values.staggerConfig}
            onChange={(newStaggerValues) =>
              setValues((values) => ({
                ...values,
                staggerConfig: {
                  ...values.staggerConfig,
                  ...newStaggerValues,
                },
              }))
            }
            errors={errors.staggerConfig}
          />
        </>
      )}

      <FormSection title="Actions">
        <div className="form-group">
          <div className="col-sm-12">
            <LoadingButton
              className="!ml-0"
              data-cy="update-stack-button"
              size="small"
              disabled={!isValid || staggerUpdating}
              isLoading={isLoading}
              button-spinner="$ctrl.actionInProgress"
              loadingText="正在更新..."
            >
              更新堆栈
            </LoadingButton>
          </div>
          {staggerUpdating && (
            <div className="col-sm-12">
              <FormError>
                存在并发更新，暂时无法更新该堆栈
              </FormError>
            </div>
          )}
        </div>
      </FormSection>
    </Form>
  );

  function handleContentChange(type: DeploymentType, content: string) {
    setFieldValue('content', content);
    setContentCache(type, content);
  }

  async function handleVersionChange(newVersion: number) {
    if (!versionOptions) {
      return;
    }

    const fileContent = await getEdgeStackFile(edgeStack.Id, newVersion).catch(
      () => ''
    );
    if (fileContent) {
      if (versionOptions.length > 1) {
        if (newVersion < versionOptions[0]) {
          setSelectedVersion(newVersion);
        } else {
          setSelectedVersion(versionOptions[0]);
        }
      }
      handleContentChange(values.deploymentType, fileContent);
    }
  }
}

function useCachedContent() {
  const [cachedContent, setCachedContent] = useState({
    [DeploymentType.Compose]: '',
    [DeploymentType.Kubernetes]: '',
  });

  function handleChangeContent(type: DeploymentType, content: string) {
    setCachedContent((cache) => ({ ...cache, [type]: content }));
  }

  return {
    setContentCache: handleChangeContent,
    getCachedContent: (type: DeploymentType) => cachedContent[type],
  };
}

function formValidation(): SchemaOf<FormValues> {
  return object({
    content: string().required('内容为必填项'),
    deploymentType: number()
      .oneOf([0, 1, 2])
      .required('部署类型为必填项'),
    privateRegistryId: number().optional(),
    prePullImage: boolean().default(false),
    retryDeploy: boolean().default(false),
    useManifestNamespaces: boolean().default(false),
    edgeGroups: array()
      .of(number().required())
      .required()
      .min(1, '至少需要选择一个 Edge 组'),
    webhookEnabled: boolean().default(false),
    versions: array().of(number().optional()).optional(),
    envVars: envVarValidation(),
    rollbackTo: number().optional(),
    staggerConfig: staggerConfigValidation(),
  });
}
