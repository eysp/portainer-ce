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
            icon={EyeOff}
            onClick={() => handleShowOrHide(true)}
            disabled={isLimited}
          >
            隐藏所有用户
          </Button>
          <BEFeatureIndicator featureId={FeatureId.HIDE_DOCKER_HUB_ANONYMOUS} />
          {isLimited ? null : (
            <Tooltip
              message="这将隐藏任何注册表下拉提示中的选项，但不会阻止用户通过YAML直接匿名部署来自Docker Hub的镜像。
              注意：如果用户没有其他可用的注册表选项，Docker Hub（匿名）将继续显示为唯一选项。"
            />
          )}
        </div>
      ) : (
        <div className="vertical-center">
          <Button icon={Eye} onClick={() => handleShowOrHide(false)}>
            对所有用户显示
          </Button>
          <Tooltip
            message="这将在任何注册表下拉提示中显示选项。
            （但请注意，如果用户没有凭证的Docker Hub选项可用，只会显示Docker Hub（匿名）选项）。"
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
            '默认注册表设置已成功更新'
          );
        },
      }
    );
  }
}
