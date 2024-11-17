import { HardDrive } from 'lucide-react';

import { NodeViewModel } from '@/docker/models/node';

import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { mergeOptions } from '@@/datatables/extend-options/mergeOptions';
import { withMeta } from '@@/datatables/extend-options/withMeta';
import { withControlledSelected } from '@@/datatables/extend-options/withControlledSelected';

import { useColumns } from './useColumns';

const tableKey = 'macvlan-nodes-selector';
const store = createPersistedStore(tableKey);

export function MacvlanNodesSelector({
  dataset,
  isIpColumnVisible,
  haveAccessToNode,
  value,
  onChange,
}: {
  dataset?: Array<NodeViewModel>;
  isIpColumnVisible: boolean;
  haveAccessToNode: boolean;
  value: Array<NodeViewModel>;
  onChange(value: Array<NodeViewModel>): void;
}) {
  const columns = useColumns(isIpColumnVisible);
  const tableState = useTableState(store, tableKey);

  return (
    <Datatable<NodeViewModel>
      title="选择要部署本地配置的节点"
      titleIcon={HardDrive}
      columns={columns}
      dataset={dataset || []}
      isLoading={!dataset}
      emptyContentLabel="没有可用的节点"
      settingsManager={tableState}
      extendTableOptions={mergeOptions(
        withMeta({
          table: 'nodes',
          haveAccessToNode,
        }),
        withControlledSelected(
          (ids) =>
            onChange(dataset?.filter((n) => n.Id && ids.includes(n.Id)) || []),
          value.map((n) => n.Id || '')
        )
      )}
    />
  );
}
