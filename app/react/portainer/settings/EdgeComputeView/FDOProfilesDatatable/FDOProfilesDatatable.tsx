import { List } from 'lucide-react';

import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';

import { columns } from './columns';
import { FDOProfilesDatatableActions } from './FDOProfilesDatatableActions';
import { useFDOProfiles } from './useFDOProfiles';

const storageKey = 'fdoProfiles';

const settingsStore = createPersistedStore(storageKey, 'name');

export interface FDOProfilesDatatableProps {
  isFDOEnabled: boolean;
}

export function FDOProfilesDatatable({
  isFDOEnabled,
}: FDOProfilesDatatableProps) {
  const tableState = useTableState(settingsStore, storageKey);

  const { isLoading, profiles } = useFDOProfiles();

  return (
    <Datatable
      columns={columns}
      dataset={profiles}
      settingsManager={tableState}
      title="设备配置文件"
      titleIcon={List}
      disableSelect={!isFDOEnabled}
      emptyContentLabel="未找到配置文件"
      getRowId={(row) => row.id.toString()}
      isLoading={isLoading}
      renderTableActions={(selectedItems) => (
        <FDOProfilesDatatableActions
          isFDOEnabled={isFDOEnabled}
          selectedItems={selectedItems}
        />
      )}
    />
  );
}
