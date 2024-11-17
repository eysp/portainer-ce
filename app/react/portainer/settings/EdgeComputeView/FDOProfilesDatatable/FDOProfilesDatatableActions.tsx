import { useQueryClient } from 'react-query';
import { useRouter } from '@uirouter/react';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Profile } from '@/portainer/hostmanagement/fdo/model';
import * as notifications from '@/portainer/services/notifications';
import {
  deleteProfile,
  duplicateProfile,
} from '@/portainer/hostmanagement/fdo/fdo.service';

import { confirm, confirmDestructive } from '@@/modals/confirm';
import { Link } from '@@/Link';
import { Button } from '@@/buttons';
import { buildConfirmButton } from '@@/modals/utils';

interface Props {
  isFDOEnabled: boolean;
  selectedItems: Profile[];
}

export function FDOProfilesDatatableActions({
  isFDOEnabled,
  selectedItems,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div className="actionBar">
      <Link to="portainer.endpoints.profile" className="space-left">
        <Button disabled={!isFDOEnabled} icon={PlusCircle}>
          添加配置文件
        </Button>
      </Link>

      <Button
        disabled={!isFDOEnabled || selectedItems.length !== 1}
        onClick={() => onDuplicateProfileClick()}
        icon={PlusCircle}
      >
        复制
      </Button>

      <Button
        disabled={!isFDOEnabled || selectedItems.length < 1}
        color="danger"
        onClick={() => onDeleteProfileClick()}
        icon={Trash2}
      >
        删除
      </Button>
    </div>
  );

  async function onDuplicateProfileClick() {
    const confirmed = await confirm({
      title: '您确定吗？',
      message: '此操作将复制选定的配置文件。是否继续？',
    });

    if (!confirmed) {
      return;
    }

    try {
      const profile = selectedItems[0];
      const newProfile = await duplicateProfile(profile.id);
      notifications.success('配置文件成功复制', profile.name);
      router.stateService.go('portainer.endpoints.profile.edit', {
        id: newProfile.id,
      });
    } catch (err) {
      notifications.error(
        '失败',
        err as Error,
        '无法复制配置文件'
      );
    }
  }

  async function onDeleteProfileClick() {
    const confirmed = await confirmDestructive({
      title: '您确定吗？',
      message: '此操作将删除选定的配置文件。是否继续？',
      confirmButton: buildConfirmButton('删除', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    await Promise.all(
      selectedItems.map(async (profile) => {
        try {
          await deleteProfile(profile.id);

          notifications.success('配置文件成功删除', profile.name);
        } catch (err) {
          notifications.error(
            '失败e',
            err as Error,
            '无法删除配置文件'
          );
        }
      })
    );

    await queryClient.invalidateQueries('fdo_profiles');
  }
}
