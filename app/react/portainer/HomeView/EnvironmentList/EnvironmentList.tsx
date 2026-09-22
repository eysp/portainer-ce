import React, { ReactNode, useMemo } from 'react';

import {
  Environment,
  EnvironmentStatus,
  PlatformType,
  EnvironmentHealth,
} from '@/react/portainer/environments/types';
import {
  refetchIfAnyOffline,
  SortType,
  useEnvironmentList,
} from '@/react/portainer/environments/queries/useEnvironmentList';
import { useGroups } from '@/react/portainer/environments/environment-groups/queries';
import { EnvironmentsQueryParams } from '@/react/portainer/environments/environment.service';
import { useIsPureAdmin } from '@/react/hooks/useUser';
import {
  getPlatformType,
  isEdgeEnvironment,
} from '@/react/portainer/environments/utils';
import { useEnvironmentSummaryCounts } from '@/react/portainer/environments/queries/useEnvironmentSummaryCounts';
import { useParseSortGroupApiParams } from '@/react/portainer/environments/queries/useParseApiSortParams';
import { useBaseApiQueryParams } from '@/react/portainer/environments/queries/useBaseApiQueryParams';
import { useAvailableSortGroups } from '@/react/portainer/environments/queries/useAvailableSortGroups';
import { getPlatformIconByPlatform } from '@/react/portainer/environments/utils/get-platform-icon';
import { getHealthIcon } from '@/react/portainer/environments/utils/get-health-icon';
import { getGroupIcon } from '@/react/portainer/environments/utils/get-group-icon';
import { UpdateBadge } from '@/react/portainer/HomeView/EnvironmentList/UpdateBadge';
import { KubeconfigButton } from '@/react/portainer/HomeView/EnvironmentList/KubeconfigButton';
import { EnvironmentCard } from '@/react/portainer/HomeView/EnvironmentList/EnvironmentItem/EnvironmentCard';

import { DropdownOption } from '@@/DropdownMenu/DropdownMenu';
import {
  SortableGroup,
  SortableList,
  SortOption,
} from '@@/SortableList/SortableList';

import { useHomeViewState } from '../useHomeViewState';

import { NoEnvironmentsInfoPanel } from './NoEnvironmentsInfoPanel';

interface Props {
  onClickBrowse(environment: Environment): void;
}

const SORT_OPTIONS: SortOption<SortType>[] = [
  {
    key: 'Id',
    label: '时间',
    descendingLabel: '最新',
    ascendingLabel: '最早',
  },
  { key: 'Group', label: '分组', grouped: true },
  { key: 'PlatformType', label: '平台', grouped: true },
  { key: 'Health', label: '健康状态', grouped: true },
];

const platformDetails: Record<
  string,
  { type: PlatformType; description: string }
> = {
  Docker: {
    type: PlatformType.Docker,
    description: 'Docker 主机与 Swarm 集群',
  },
  Kubernetes: {
    type: PlatformType.Kubernetes,
    description: 'Kubernetes 集群与节点',
  },
  Azure: { type: PlatformType.Azure, description: 'Azure 容器实例' },
  Podman: { type: PlatformType.Podman, description: 'Podman 容器' },
};

const healthDetails: Record<
  string,
  { type: EnvironmentHealth; description: string }
> = {
  Up: {
    type: EnvironmentHealth.Up,
    description: '环境在线且为最新版本',
  },
  Down: {
    type: EnvironmentHealth.Down,
    description: '环境当前离线或无法连通',
  },
  Outdated: {
    type: EnvironmentHealth.Outdated,
    description: '环境代理版本可升级',
  },
  Heartbeat: {
    type: EnvironmentHealth.Heartbeat,
    description: '心跳活跃的边缘环境',
  },
};

const GROUP_FIELD: Partial<Record<SortType, (item: EnvironmentRow) => string>> =
  {
    Group: (item) => item.GroupId.toString(),
    PlatformType: (item) => item.platformName,
    Health: (item) => item.healthLabel,
  };

export function EnvironmentList({ onClickBrowse }: Props) {
  const isPureAdmin = useIsPureAdmin();
  const summaryQuery = useEnvironmentSummaryCounts();

  const tableState = useHomeViewState();

  const groupsQuery = useGroups();

  const groupDetails = useMemo(
    () =>
      Object.fromEntries(
        (groupsQuery.data ?? []).map((group) => [
          group.Id.toString(),
          { name: group.Name, description: group.Description },
        ])
      ),
    [groupsQuery.data]
  );

  const baseQueryParams: EnvironmentsQueryParams = useBaseApiQueryParams(
    tableState.search
  );

  const sortGroupApiParams = useParseSortGroupApiParams(
    tableState.groupFilter,
    tableState.groupKey,
    groupsQuery.data
  );

  const listQueryParams: EnvironmentsQueryParams = useMemo(
    () => ({ ...baseQueryParams, ...sortGroupApiParams }),
    [baseQueryParams, sortGroupApiParams]
  );

  const availableGroupsBySort = useAvailableSortGroups(summaryQuery.data);

  const sortOrder = tableState.sortBy?.desc ? 'desc' : 'asc';

  const { isLoading, environments, totalCount, updateAvailable } =
    useEnvironmentList(
      {
        page: tableState.page + 1,
        pageLimit: tableState.pageSize,
        sort: tableState.groupKey,
        order: sortOrder,
        ...listQueryParams,
      },
      { refetchInterval: refetchIfAnyOffline }
    );

  const environmentRows = useMemo<EnvironmentRow[]>(() => {
    return environments.map((env) => ({
      ...env,
      groupName: groupDetails[env.GroupId.toString()]?.name ?? 'Unassigned',
      platformName:
        PlatformType[getPlatformType(env.Type, env.ContainerEngine)],
      healthLabel: getHealthLabel(env, tableState.groupFilter),
    }));
  }, [environments, groupDetails, tableState.groupFilter]);

  const environmentGroups = useMemo(
    () =>
      buildGroups(
        environmentRows,
        tableState.groupKey,
        availableGroupsBySort,
        groupDetails
      ),
    [environmentRows, tableState.groupKey, availableGroupsBySort, groupDetails]
  );

  const headerButtons = [
    updateAvailable && <UpdateBadge key="update-badge" />,
    <KubeconfigButton
      key="kube-config-button"
      environments={environments}
      envQueryParams={listQueryParams}
    />,
  ].filter((btn): btn is React.ReactElement => Boolean(btn));

  return (
    <div className="flex flex-col gap-2">
      {summaryQuery.isSuccess && summaryQuery.data.total === 0 && (
        <NoEnvironmentsInfoPanel isAdmin={isPureAdmin} />
      )}
      <SortableList
        isLoading={isLoading}
        renderItem={(row: EnvironmentRow) => (
          <EnvironmentCard
            environment={row}
            groupName={row.groupName}
            onClickBrowse={() => onClickBrowse(row)}
          />
        )}
        tableState={tableState}
        sortOptions={SORT_OPTIONS}
        groupOptions={availableGroupsBySort}
        totalCount={totalCount}
        groups={environmentGroups}
        searchPlaceholder="搜索环境..."
        emptyMessage="暂无可用环境。"
        headerButtons={headerButtons}
        data-cy="home-endpointList"
        showGroupHeaders
      />
    </div>
  );
}

type EnvironmentRow = Environment & {
  groupName: string;
  platformName: string;
  healthLabel: string;
};

function getHealthLabel(
  env: Environment,
  sortGroupFilter: string | null
): string {
  // When a health filter is applied the server only returns environments
  // matching that filter, so we trust the filter value as the label.
  if (sortGroupFilter !== null) {
    return sortGroupFilter;
  }

  const status = resolveBaseStatus(env);
  if (env.Agent.IsOutdated && status !== 'Down') {
    return 'Outdated';
  }
  return status;
}

function resolveBaseStatus(env: Environment): string {
  if (isEdgeEnvironment(env.Type)) {
    return env.Heartbeat ? 'Heartbeat' : 'Down';
  }
  switch (env.Status) {
    case EnvironmentStatus.Up:
      return 'Up';
    case EnvironmentStatus.Down:
    case EnvironmentStatus.Provisioning:
    case EnvironmentStatus.Error:
      return 'Down';
    default:
      return 'Unknown';
  }
}

function buildGroups(
  items: EnvironmentRow[],
  sortBy: SortType,
  groupOptions: Record<string, DropdownOption[]>,
  groupDetails: Record<string, { name: string; description: string }>
): SortableGroup<EnvironmentRow>[] {
  if (!items?.length) return [];
  const options = groupOptions[sortBy];
  const getField = GROUP_FIELD[sortBy];
  if (!options?.length || !getField) {
    return [{ key: 'all', label: 'All', items }];
  }
  const itemsByKey = new Map<string, EnvironmentRow[]>();
  for (const item of items) {
    const key = getField(item);
    const bucket = itemsByKey.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      itemsByKey.set(key, [item]);
    }
  }

  return options.flatMap(({ key, label: optLabel }) => {
    const groupItems = itemsByKey.get(key);
    if (!groupItems?.length) return [];

    const label = optLabel ?? key;
    let icon: ReactNode;
    let description: string | undefined;

    if (sortBy === 'PlatformType' && platformDetails[key]) {
      icon = getPlatformIconByPlatform(platformDetails[key].type, 'md');
      description = platformDetails[key].description;
    } else if (sortBy === 'Health' && healthDetails[key]) {
      icon = getHealthIcon(healthDetails[key].type, 'md');
      description = healthDetails[key].description;
    } else if (sortBy === 'Group') {
      icon = getGroupIcon('md');
      description = groupDetails[key]?.description;
    }

    return [{ key, label, icon, description, items: groupItems }];
  });
}
