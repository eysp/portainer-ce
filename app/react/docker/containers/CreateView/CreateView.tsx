import { Formik } from 'formik';
import { useRouter } from '@uirouter/react';
import { useEffect, useState } from 'react';

import { useIsEdgeAdmin, useIsEnvironmentAdmin } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';
import { Registry } from '@/react/portainer/registries/types/registry';
import { notifySuccess } from '@/portainer/services/notifications';
import { useAnalytics } from '@/react/hooks/useAnalytics';
import { useDebouncedValue } from '@/react/hooks/useDebouncedValue';

import { PageHeader } from '@@/PageHeader';
import { ImageConfigValues } from '@@/ImageConfigFieldset';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';
import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { HelpLink } from '@@/HelpLink';

import { useContainers } from '../queries/useContainers';
import { useSystemLimits, useIsWindows } from '../../proxy/queries/useInfo';

import { useCreateOrReplaceMutation } from './useCreateMutation';
import { useValidation } from './validation';
import { useInitialValues, Values } from './useInitialValues';
import { InnerForm } from './InnerForm';
import { toRequest } from './toRequest';

export function CreateView() {
  return (
    <>
      <PageHeader
        title="创建容器"
        breadcrumbs={[
          { label: '容器', link: 'docker.containers' },
          '添加容器',
        ]}
        reload
      />

      <CreateForm />
    </>
  );
}

function CreateForm() {
  const environmentId = useEnvironmentId();
  const router = useRouter();
  const isWindows = useIsWindows(environmentId);
  const { trackEvent } = useAnalytics();
  const isAdminQuery = useIsEdgeAdmin();
  const { authorized: isEnvironmentAdmin } = useIsEnvironmentAdmin({
    adminOnlyCE: true,
  });
  const [isDockerhubRateLimited, setIsDockerhubRateLimited] = useState(false);

  const mutation = useCreateOrReplaceMutation();
  const initialValuesQuery = useInitialValues(
    mutation.isLoading || mutation.isSuccess,
    isWindows
  );
  const registriesQuery = useEnvironmentRegistries(environmentId);

  const { oldContainer, syncName } = useOldContainer(
    initialValuesQuery?.initialValues?.name
  );

  const { maxCpu, maxMemory } = useSystemLimits(environmentId);

  const envQuery = useCurrentEnvironment();

  const validationSchema = useValidation({
    isAdmin: isAdminQuery.isAdmin,
    maxCpu,
    maxMemory,
    isDuplicating: initialValuesQuery?.isDuplicating,
    isDuplicatingPortainer: oldContainer?.IsPortainer,
    isDockerhubRateLimited,
  });

  if (!envQuery.data || !initialValuesQuery) {
    return null;
  }

  const environment = envQuery.data;

  // if windows, hide capabilities. this is because capadd and capdel are not supported on windows
  const hideCapabilities =
    (!environment.SecuritySettings.allowContainerCapabilitiesForRegularUsers &&
      !isEnvironmentAdmin) ||
    isWindows;

  const {
    isDuplicating = false,
    initialValues,
    extraNetworks,
  } = initialValuesQuery;

  return (
    <>
      {isDuplicating && (
        <InformationPanel title-text="Caution">
          <TextTip>
            如果更改了镜像，新容器可能无法启动，并且之前容器的设置可能不兼容。常见原因包括入口点、命令或由镜像设置的{' '}
            <HelpLink docLink="/user/docker/containers/advanced">
              其他设置
            </HelpLink>{' '}
            。
          </TextTip>
        </InformationPanel>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={validationSchema}
      >
        <InnerForm
          hideCapabilities={hideCapabilities}
          onChangeName={syncName}
          isDuplicate={isDuplicating}
          isLoading={mutation.isLoading}
          onRateLimit={(limited = false) => setIsDockerhubRateLimited(limited)}
        />
      </Formik>
    </>
  );

  async function handleSubmit(values: Values) {
    if (oldContainer) {
      const confirmed = await confirmDestructive({
        title: '您确定吗？',
        message:
          '已经存在一个相同名称的容器。Portainer 可以自动删除它并重新创建一个新的容器。您是否要替换它？',
        confirmButton: buildConfirmButton('替换', 'danger'),
      });

      if (!confirmed) {
        return false;
      }
    }

    const registry = getRegistry(values.image, registriesQuery.data || []);
    const config = toRequest(values, registry, hideCapabilities);

    return mutation.mutate(
      {
        config,
        environment,
        values: {
          accessControl: values.accessControl,
          imageName: values.image.image,
          name: values.name,
          alwaysPull: values.alwaysPull,
          enableWebhook: values.enableWebhook,
          nodeName: values.nodeName,
        },
        registry,
        oldContainer,
        extraNetworks,
      },
      {
        onSuccess() {
          sendAnalytics(values, registry);
          notifySuccess('成功', '容器已成功创建');
          router.stateService.go('docker.containers');
        },
      }
    );
  }

  function sendAnalytics(values: Values, registry?: Registry) {
    const containerImage = registry?.URL
      ? `${registry?.URL}/${values.image}`
      : values.image;
    if (values.resources.gpu.enabled) {
      trackEvent('gpuContainerCreated', {
        category: 'docker',
        metadata: { gpu: values.resources.gpu, containerImage },
      });
    }
  }
}

function getRegistry(image: ImageConfigValues, registries: Registry[]) {
  return image.useRegistry
    ? registries.find((registry) => registry.Id === image.registryId)
    : undefined;
}

function useOldContainer(initialName?: string) {
  const environmentId = useEnvironmentId();

  const [name, setName] = useState(initialName);
  const debouncedName = useDebouncedValue(name, 1000);
  const oldContainerQuery = useContainers(environmentId, {
    enabled: !!debouncedName,
    filters: {
      name: [`^/${debouncedName}$`],
    },
  });

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  return {
    syncName: setName,
    oldContainer:
      oldContainerQuery.data && oldContainerQuery.data.length > 0
        ? oldContainerQuery.data[0]
        : undefined,
  };
}
