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
            对所有用户隐藏
          </Button>
          <BEFeatureIndicator featureId={FeatureId.HIDE_DOCKER_HUB_ANONYMOUS} />
          {isLimited ? null : (
            <Tooltip
              message="这将隐藏任何注册表下拉提示中的此选项，但不会阻止用户通过 YAML 直接从 Docker Hub 匿名部署。
            注意：如果用户没有其他可用的注册表，Docker Hub（匿名）仍将作为唯一选项显示。"
            />
          )}
        </div>
      ) : (
        <div className="vertical-center">
          <Button icon={Eye} onClick={() => handleShowOrHide(false)}>
            对所有用户显示
          </Button>
          <Tooltip
            message="这将显示任何注册表下拉提示中的此选项。
                    （但请注意，只有在没有凭证的 Docker Hub 选项可供用户选择时，Docker Hub（匿名）选项才会显示）。"
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
