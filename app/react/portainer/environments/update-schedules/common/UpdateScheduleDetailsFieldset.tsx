import _ from 'lodash';

import { Environment } from '@/react/portainer/environments/types';
import { semverCompare } from '@/react/common/semver-utils';

import { TextTip } from '@@/Tip/TextTip';

import { VersionSelect } from './VersionSelect';
import { ScheduledTimeField } from './ScheduledTimeField';

interface Props {
  environments: Environment[];
  hasTimeZone: boolean;
  hasNoTimeZone: boolean;
  hasGroupSelected: boolean;
  version: string;
}

export function UpdateScheduleDetailsFieldset({
  environments,
  hasTimeZone,
  hasNoTimeZone,
  hasGroupSelected,
  version,
}: Props) {
  const minVersion = _.first(
    _.compact<string>(environments.map((env) => env.Agent.Version)).sort(
      (a, b) => semverCompare(a, b)
    )
  );

  return (
    <>
      {environments.length > 0 ? (
        !!version && (
          <TextTip color="blue">
            {environments.length} 个环境将更新到 {version} 版本
          </TextTip>
        )
      ) : (
        <TextTip color="orange">
          所选 edge 分组中没有可用的环境
        </TextTip>
      )}
      <VersionSelect minVersion={minVersion} />

      {hasTimeZone && hasGroupSelected && <ScheduledTimeField />}
      {hasNoTimeZone && (
        <TextTip>
          这些 edge 分组中的 edge agent 版本较旧，不支持计划更新，将会立即执行
        </TextTip>
      )}
    </>
  );
}
