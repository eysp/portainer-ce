import { useMemo } from 'react';

import { useTags } from '@/portainer/tags/queries';

import {
  SortableGroup,
  SortableList,
  SortOption,
} from '@@/SortableList/SortableList';
import { useSortableListState } from '@@/SortableList/sortable-list.store';

import { useGroups } from '../../queries/useGroups';
import { EnvironmentGroup } from '../../types';
import { isUngoverned } from '../../utils/getPlatformLabel';

import { EnvironmentGroupRow } from './EnvironmentGroupRow';

const SORT_OPTIONS: SortOption[] = [{ key: 'Name', label: '名称' }];

export function EnvironmentGroupsTable() {
  const groupsQuery = useGroups();
  const tagsQuery = useTags();
  const tableState = useSortableListState('environment_groups', 'Name');

  const sorted = useMemo(() => {
    const data = groupsQuery.data ?? [];
    const governed = data.filter((g) => !isUngoverned(g));
    const ungoverned = data.filter((g) => isUngoverned(g));
    const sortedGoverned = [...governed].sort((a, b) => {
      const cmp = a.Name.localeCompare(b.Name);
      return tableState.sortBy?.desc ? -cmp : cmp;
    });
    return [...sortedGoverned, ...ungoverned];
  }, [groupsQuery.data, tableState.sortBy?.desc]);

  const filtered = useMemo(() => {
    const term = tableState.search.toLowerCase();
    if (!term) return sorted;
    return sorted.filter(
      (g) =>
        g.Name.toLowerCase().includes(term) ||
        g.Description?.toLowerCase().includes(term)
    );
  }, [sorted, tableState.search]);

  const pageItems = useMemo(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filtered.length / tableState.pageSize)
    );
    const safePage = Math.min(tableState.page, totalPages - 1);
    const start = safePage * tableState.pageSize;
    return filtered.slice(start, start + tableState.pageSize);
  }, [filtered, tableState.page, tableState.pageSize]);

  const groups = useMemo(() => buildGroups(pageItems), [pageItems]);

  return (
    <SortableList
      tableState={tableState}
      sortOptions={SORT_OPTIONS}
      groups={groups}
      totalCount={filtered.length}
      renderItem={(group) => (
        <EnvironmentGroupRow group={group} tags={tagsQuery.data} />
      )}
      getItemKey={(group) => group.Id}
      isLoading={groupsQuery.isLoading}
      searchPlaceholder="过滤分组..."
      emptyMessage={
        tableState.search
          ? '未找到匹配的分组'
          : '未找到环境分组'
      }
      data-cy="environment-groups-list"
    />
  );
}

function buildGroups(
  items: EnvironmentGroup[]
): SortableGroup<EnvironmentGroup>[] {
  const governed = items.filter((g) => !isUngoverned(g));
  const ungoverned = items.filter((g) => isUngoverned(g));
  const result: SortableGroup<EnvironmentGroup>[] = [];
  if (governed.length) {
    result.push({ key: 'governed', label: '分组', items: governed });
  }
  if (ungoverned.length) {
    result.push({ key: 'ungoverned', label: '未接管', items: ungoverned });
  }
  return result;
}
