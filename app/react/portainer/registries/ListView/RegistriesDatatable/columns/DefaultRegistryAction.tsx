import { Eye, EyeOff } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isLimitedToBE } from '@/react/portainer/feature-flags/feature-flags.service';
import {
  usePublicSettings,
  useUpdateDefaultRegistrySettingsMutation,
} from '@/react/portainer/settings/queries';

import { Tooltip } from '@@/Tip/Tooltip';
import { Button } from '@@/buttons';
import { BEFeatureIndicator } from '@@/BEFeatureIndicator';

export function DefaultRegistryAction() {
  const settingsQuery = usePublicSettings({
    select: (settings) => settings.DefaultRegistry?.Hide,
  });
  const defaultRegistryMutation = useUpdateDefaultRegistrySettingsMutation();

  if (!settingsQuery.isSuccess) {
    return null;
  }
  const hideDefaultRegistry = settingsQuery.data;

  const isLimited = isLimitedToBE(FeatureId.HIDE_DOCKER_HUB_ANONYMOUS);

  return (
    <>
      {!hideDefaultRegistry ? (
        <div className="vertical-center">
          <Button
            color="danger"
            data-cy="hide-default-registry-button"
            icon={EyeOff}
            onClick={() => handleShowOrHide(true)}
            disabled={isLimited}
          >
            对所有用户隐藏
          </Button>
          <BEFeatureIndicator featureId={FeatureId.HIDE_DOCKER_HUB_ANONYMOUS} />
          {isLimited && (
            <Tooltip
              message="这将在任何镜像仓库下拉列表中隐藏该选项，但不会阻止用户直接通过 YAML 从 Docker Hub 匿名部署。注意：如果用户没有其他可用仓库，Docker Hub (匿名) 仍将作为唯一选项显示。"
            />
          )}
        </div>
      ) : (
        <div className="vertical-center">
          <Button
            data-cy="show-default-registry-button"
            icon={Eye}
            onClick={() => handleShowOrHide(false)}
          >
            对所有用户显示
          </Button>
          <Tooltip
            message="这将在任何仓库下拉菜单中恢复显示该选项。(请注意：只有在没有配置凭据的 Docker Hub 时，才会显示匿名选项)。"
          />
        </div>
      )}
    </>
  );

  function handleShowOrHide(hideDefaultRegistry: boolean) {
    defaultRegistryMutation.mutate(
      {
        Hide: hideDefaultRegistry,
      },
      {
        onSuccess() {
          notifySuccess(
            '成功',
            '默认仓库设置已成功更新'
          );
        },
      }
    );
  }
}
