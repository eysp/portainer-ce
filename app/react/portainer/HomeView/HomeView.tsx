import { useStore } from 'zustand';
import { useCurrentStateAndParams, useRouter } from '@uirouter/react';
import { useEffect, useState } from 'react';

import { environmentStore } from '@/react/hooks/current-environment-store';
import { Environment } from '@/react/portainer/environments/types';
import { snapshotEndpoints } from '@/react/portainer/environments/environment.service';
import { isEdgeEnvironment } from '@/react/portainer/environments/utils';
import * as notifications from '@/portainer/services/notifications';

import { confirm } from '@@/modals/confirm';
import { PageHeader } from '@@/PageHeader';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

import { EnvironmentList } from './EnvironmentList';
import { EdgeLoadingSpinner } from './EdgeLoadingSpinner';
import { MotdPanel } from './MotdPanel';
import { LicenseNodePanel } from './LicenseNodePanel';
import { BackupFailedPanel } from './BackupFailedPanel';

export function HomeView() {
  const { clear: clearStore } = useStore(environmentStore);

  const { params } = useCurrentStateAndParams();
  const [connectingToEdgeEndpoint, setConnectingToEdgeEndpoint] = useState(
    !!params.redirect
  );

  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      const options = {
        title: `连接到 ${params.environmentName} 失败`,
        message: `连接到边缘代理时出现问题。点击下面的“重试”按钮立即重试，或者等待 10 秒钟自动重试。`,
        confirmButton: buildConfirmButton('重试', 'primary', 10),
        modalType: ModalType.Destructive,
      };

      if (await confirm(options)) {
        setConnectingToEdgeEndpoint(true);
        router.stateService.go(params.route, {
          endpointId: params.environmentId,
        });
      } else {
        clearStore();
        router.stateService.go(
          'portainer.home',
          {},
          { reload: true, inherit: false }
        );
      }
    }

    if (params.redirect) {
      redirect();
    }
  }, [params, setConnectingToEdgeEndpoint, router, clearStore]);

  return (
    <>
      <PageHeader
        reload
        title="首页"
        breadcrumbs={[{ label: '环境' }]}
      />

      {process.env.PORTAINER_EDITION !== 'CE' && <LicenseNodePanel />}

      <MotdPanel />

      {process.env.PORTAINER_EDITION !== 'CE' && <BackupFailedPanel />}

      {connectingToEdgeEndpoint ? (
        <EdgeLoadingSpinner />
      ) : (
        <EnvironmentList
          onClickBrowse={handleBrowseClick}
          onRefresh={confirmTriggerSnapshot}
        />
      )}
    </>
  );

  async function confirmTriggerSnapshot() {
    const result = await confirmEndpointSnapshot();
    if (!result) {
      return;
    }
    try {
      await snapshotEndpoints();
      notifications.success('成功', '环境已更新');
      router.stateService.reload();
    } catch (err) {
      notifications.error(
        '失败',
        err as Error,
        '在环境快照过程中发生错误'
      );
    }
  }

  function handleBrowseClick(environment: Environment) {
    if (isEdgeEnvironment(environment.Type)) {
      setConnectingToEdgeEndpoint(true);
    }
  }
}

async function confirmEndpointSnapshot() {
  return confirm({
    title: '你确定吗？',
    modalType: ModalType.Warn,
    message:
      '触发手动刷新将轮询每个环境以获取其信息，这可能需要一些时间。',
  });
}
