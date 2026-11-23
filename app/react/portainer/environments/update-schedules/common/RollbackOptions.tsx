import { useFormikContext } from 'formik';
import _ from 'lodash';
import { useMemo, useEffect } from 'react';

import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { TextTip } from '@@/Tip/TextTip';

import { usePreviousVersions } from '../queries/usePreviousVersions';

import { FormValues } from './types';

export function RollbackOptions() {
  const { isLoading, count, version, versionError } = useSelectVersionOnMount();

  const groupNames = useGroupNames();

  if (versionError) {
    return <TextTip>{versionError}</TextTip>;
  }

    if (!count) {
    return (
      <TextTip>
        所选分组没有可用的回滚选项
      </TextTip>
    );
  }

  if (isLoading || !groupNames) {
    return null;
  }

  return (
    <div className="form-group">
      <div className="col-sm-12">
        来自 {groupNames} 的 {count} 个边缘设备将回滚到 {version} 版本
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

  const previousVersionsQuery = usePreviousVersions(groupIds ?? []);

  const previousVersions = useMemo(
    () =>
      previousVersionsQuery.data
        ? _.uniq(Object.values(previousVersionsQuery.data))
        : [],
    [previousVersionsQuery.data]
  );

  const previousVersionCount = useMemo(
    () => Object.keys(previousVersions).length,
    [previousVersions]
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
          '这些 edge 分组不可用回滚，因为有多个版本类型可以回滚'
        );
    }
  }, [previousVersions, setFieldError, setFieldValue]);

  return {
    isLoading: previousVersionsQuery.isLoading,
    versionError,
    version,
    count: previousVersionCount,
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
