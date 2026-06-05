import { Formik } from 'formik';
import { useRouter } from '@uirouter/react';
import { useEffect, useState } from 'react';

import { useIsEdgeAdmin, useIsEnvironmentAdmin } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';
import { Registry } from '@/react/portainer/registries/types/registry';
import { notifySuccess } from '@/portainer/services/notifications';
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
import { CreateInnerForm } from './CreateInnerForm';
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
  const isAdminQuery = useIsEdgeAdmin();
  const { authorized: isEnvironmentAdmin } = useIsEnvironmentAdmin();
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
        <div className="row">
          <div className="col-sm-12">
            <InformationPanel title-text="注意">
              <TextTip>
                如果更改了镜像，新容器可能无法启动，并且
                之前容器的设置不兼容。
                常见原因包括入口点、命令或{' '}
                <HelpLink docLink="/user/docker/containers/advanced">
                  其他设置
                </HelpLink>{' '}
                由镜像设置。
              </TextTip>
            </InformationPanel>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={validationSchema}
      >
        <CreateInnerForm
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
          '已存在同名容器。Portainer 可以自动删除它并重新创建一个。您要替换它吗？',
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
          notifySuccess('成功', '容器创建成功');
          router.stateService.go('docker.containers');
        },
      }
    );
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
