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
            {environments.length} 个环境将更新到 {version}
          </TextTip>
        )
      ) : (
        <TextTip color="orange">
          所选边缘组中没有可用的环境选项
        </TextTip>
      )}
      <VersionSelect minVersion={minVersion} />

      {hasTimeZone && hasGroupSelected && <ScheduledTimeField />}
      {hasNoTimeZone && (
        <TextTip>
          这些边缘组中的较旧版本的边缘代理不支持调度，更新将立即进行
        </TextTip>
      )}
    </>
  );
}
