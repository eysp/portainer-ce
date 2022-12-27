import { notifySuccess } from '@/portainer/services/notifications';
import { FeatureId } from '@/portainer/feature-flags/enums';
import { isLimitedToBE } from '@/portainer/feature-flags/feature-flags.service';
import {
  usePublicSettings,
  useUpdateDefaultRegistrySettingsMutation,
} from '@/react/portainer/settings/queries';

import { Tooltip } from '@@/Tip/Tooltip';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';
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
            className="btn btn-xs btn-light vertical-center"
            onClick={() => handleShowOrHide(true)}
            disabled={isLimited}
          >
            <Icon icon="eye-off" feather />
            对所有用户隐藏
          </Button>
          <BEFeatureIndicator featureId={FeatureId.HIDE_DOCKER_HUB_ANONYMOUS} />
          {isLimited ? null : (
            <Tooltip
              message="这将在任何注册表下拉提示中隐藏该选项，但并不妨碍用户通过YAML直接从Docker Hub匿名部署。
              注意：如果用户没有其他注册表可用，Docker Hub（匿名）将继续显示为唯一的选项。"
            />
          )}
        </div>
      ) : (
        <div className="vertical-center">
          <Button
            className="btn btn-xs btn-success vertical-center"
            onClick={() => handleShowOrHide(false)}
          >
            <Icon icon="eye" feather />
            Show for all users
          </Button>
          <Tooltip
            message="这将显示任何注册表下拉提示中的选项。
            (但请注意，Docker Hub（匿名）选项只在用户没有可信的Docker Hub选项时显示）。"
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
            'Success',
            '默认注册表设置更新成功'
          );
        },
      }
    );
  }
}
