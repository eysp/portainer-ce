import { useRouter } from '@uirouter/react';

import type { Environment } from '@/portainer/environments/types';
import {
  confirmAsync,
  confirmDestructiveAsync,
} from '@/portainer/services/modal.service/confirm';
import { promptAsync } from '@/portainer/services/modal.service/prompt';
import * as notifications from '@/portainer/services/notifications';
import { activateDevice } from '@/portainer/hostmanagement/open-amt/open-amt.service';
import { deleteEndpoint } from '@/portainer/environments/environment.service';

import { Button } from '@@/buttons';
import { Link } from '@@/Link';

interface Props {
  selectedItems: Environment[];
  isFDOEnabled: boolean;
  isOpenAMTEnabled: boolean;
  setLoadingMessage(message: string): void;
  showWaitingRoomLink: boolean;
}

enum DeployType {
  FDO = 'FDO',
  MANUAL = 'MANUAL',
}

export function EdgeDevicesDatatableActions({
  selectedItems,
  isOpenAMTEnabled,
  isFDOEnabled,
  setLoadingMessage,
  showWaitingRoomLink,
}: Props) {
  const router = useRouter();

  return (
    <div className="actionBar">
      <Button
        disabled={selectedItems.length < 1}
        color="danger"
        onClick={() => onDeleteEdgeDeviceClick()}
        icon="trash-2"
        featherIcon
      >
        Remove
      </Button>

      <Button onClick={() => onAddNewDeviceClick()} icon="plus" featherIcon>
        Add Device
      </Button>

      {isOpenAMTEnabled && (
        <Button
          disabled={selectedItems.length !== 1}
          onClick={() => onAssociateOpenAMTClick(selectedItems)}
          icon="link"
          featherIcon
        >
          Associate with OpenAMT
        </Button>
      )}

      {showWaitingRoomLink && (
        <Link to="edge.devices.waiting-room">
          <Button>Waiting Room</Button>
        </Link>
      )}
    </div>
  );

  async function onDeleteEdgeDeviceClick() {
    const confirmed = await confirmDestructiveAsync({
      title: '你确定吗？',
      message:
        '这个动作将删除与您的环境相关的所有配置。继续吗？',
      buttons: {
        confirm: {
          label: '删除',
          className: 'btn-danger',
        },
      },
    });

    if (!confirmed) {
      return;
    }

    await Promise.all(
      selectedItems.map(async (environment) => {
        try {
          await deleteEndpoint(environment.Id);

          notifications.success(
            '环境成功删除',
            environment.Name
          );
        } catch (err) {
          notifications.error(
            'Failure',
            err as Error,
            '无法删除环境'
          );
        }
      })
    );

    await router.stateService.reload();
  }

  async function onAddNewDeviceClick() {
    const result = isFDOEnabled
      ? await promptAsync({
          title: '您希望如何添加边缘设备？',
          inputType: 'radio',
          inputOptions: [
            {
              text: 'Provision bare-metal using Intel FDO',
              value: DeployType.FDO,
            },
            {
              text: '手动部署代理',
              value: DeployType.MANUAL,
            },
          ],
          buttons: {
            confirm: {
              label: '确认',
              className: 'btn-primary',
            },
          },
        })
      : DeployType.MANUAL;

    switch (result) {
      case DeployType.FDO:
        router.stateService.go('portainer.endpoints.importDevice');
        break;
      case DeployType.MANUAL:
        router.stateService.go('portainer.wizard.endpoints', {
          edgeDevice: true,
        });
        break;
      default:
        break;
    }
  }

  async function onAssociateOpenAMTClick(selectedItems: Environment[]) {
    const selectedEnvironment = selectedItems[0];

    const confirmed = await confirmAsync({
      title: '',
      message: `将 ${selectedEnvironment.Name} 与OpenAMT关联`,
      buttons: {
        cancel: {
          label: '取消',
          className: 'btn-default',
        },
        confirm: {
          label: '确认',
          className: 'btn-primary',
        },
      },
    });

    if (!confirmed) {
      return;
    }

    try {
      setLoadingMessage(
        '在所选设备上激活活动管理技术...'
      );
      await activateDevice(selectedEnvironment.Id);
      notifications.success(
        'Successfully associated with OpenAMT',
        selectedEnvironment.Name
      );
    } catch (err) {
      notifications.error(
        'Failure',
        err as Error,
        'Unable to associate with OpenAMT'
      );
    } finally {
      setLoadingMessage('');
    }
  }
}
