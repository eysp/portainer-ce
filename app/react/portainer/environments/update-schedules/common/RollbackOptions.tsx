import { useFormikContext } from 'formik';
import _ from 'lodash';
import { useMemo, useEffect } from 'react';

import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { TextTip } from '@@/Tip/TextTip';

import { usePreviousVersions } from '../queries/usePreviousVersions';

import { FormValues } from './types';
import { useEdgeGroupsEnvironmentIds } from './useEdgeGroupsEnvironmentIds';

export function RollbackOptions() {
  const { isLoading, count, version, versionError } = useSelectVersionOnMount();

  const groupNames = useGroupNames();

  if (versionError) {
    return <TextTip>{versionError}</TextTip>;
  }

  if (!count) {
    return (
      <TextTip>
  您选择的组没有回滚选项可用。
</TextTip>
    );
  }

  if (isLoading || !groupNames) {
    return null;
  }

  return (
    <div className="form-group">
  <div className="col-sm-12">
    {count}个边缘设备将回滚到版本{version}，来自{groupNames}组
  </div>
</div>
  );
}

function useSelectVersionOnMount() {
  const {
    values: { groupIds, version },
    setFieldValue,
    setFieldError,
    errors: { version: versionError },
  } = useFormikContext<FormValues>();

  const environmentIdsQuery = useEdgeGroupsEnvironmentIds(groupIds);

  const previousVersionsQuery = usePreviousVersions<string[]>({
    enabled: !!environmentIdsQuery.data,
  });

  const previousVersions = useMemo(
    () =>
      previousVersionsQuery.data
        ? _.uniq(
            _.compact(
              environmentIdsQuery.data?.map(
                (envId) => previousVersionsQuery.data[envId]
              )
            )
          )
        : [],
    [environmentIdsQuery.data, previousVersionsQuery.data]
  );

  useEffect(() => {
    switch (previousVersions.length) {
      case 0:
        setFieldValue('version', '');
        setFieldError('version', '没有可用的回滚选项');
        break;
      case 1:
        setFieldValue('version', previousVersions[0]);
        break;
      default:
        setFieldError(
          'version',
          '对于这些边缘组，无法进行回滚，因为有多个版本类型可供回滚'
        );
    }
  }, [previousVersions, setFieldError, setFieldValue]);

  return {
    isLoading: previousVersionsQuery.isLoading,
    versionError,
    version,
    count: environmentIdsQuery.data?.length,
  };
}

function useGroupNames() {
  const {
    values: { groupIds },
  } = useFormikContext<FormValues>();

  const groupsQuery = useEdgeGroups({
    select: (groups) => Object.fromEntries(groups.map((g) => [g.Id, g.Name])),
  });

  if (!groupsQuery.data) {
    return null;
  }

  return groupIds.map((id) => groupsQuery.data[id]).join(', ');
}
