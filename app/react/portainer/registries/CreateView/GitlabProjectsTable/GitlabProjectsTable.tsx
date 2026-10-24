import { createColumnHelper } from '@tanstack/react-table';
import { ListIcon } from 'lucide-react';

import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { Datatable } from '@@/datatables';
import { withControlledSelected } from '@@/datatables/extend-options/withControlledSelected';
import { mergeOptions } from '@@/datatables/extend-options/mergeOptions';

import { RegistryGitlabProject } from '../../types/gitlabProject';

const helper = createColumnHelper<RegistryGitlabProject>();

const columns = [
  helper.accessor('Namespace', { header: '命名空间' }),
  helper.accessor('Name', { header: '名称' }),
  helper.accessor('PathWithNamespace', {
    header: '完整命名空间路径',
  }),
  helper.accessor('Description', { header: '描述' }),
];

const tableKey = 'gitlab-projects';
const store = createPersistedStore(tableKey, 'Name');

export function GitlabProjectTable({
  dataset,
  value,
  onChange,
}: {
  dataset: RegistryGitlabProject[];
  value: RegistryGitlabProject[];
  onChange: (value: RegistryGitlabProject[]) => void;
}) {
  const tableState = useTableState(store, tableKey);

  return (
    <Datatable
      columns={columns}
      dataset={dataset}
      settingsManager={tableState}
      title="GitLab 项目列表"
      titleIcon={ListIcon}
      extendTableOptions={mergeOptions(
        withControlledSelected(
          (ids) => onChange(dataset.filter(({ Id }) => ids.includes(`${Id}`))),
          value.map(({ Id }) => `${Id}`)
        )
      )}
      isRowSelectable={({ original: item }) => item.RegistryEnabled}
      data-cy="gitlab-projects-datatable"
    />
  );
}
