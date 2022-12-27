import _ from 'lodash';

import { Environment } from '@/portainer/environments/types';
import type { DockerContainer } from '@/react/docker/containers/types';
import { useShowGPUsColumn } from '@/react/docker/containers/utils';

import { TableSettingsMenu, Datatable } from '@@/datatables';
import {
  buildAction,
  QuickActionsSettings,
} from '@@/datatables/QuickActionsSettings';
import { ColumnVisibilityMenu } from '@@/datatables/ColumnVisibilityMenu';

import { useContainers } from '../../queries/containers';

import { createStore } from './datatable-store';
import { ContainersDatatableSettings } from './ContainersDatatableSettings';
import { useColumns } from './columns';
import { ContainersDatatableActions } from './ContainersDatatableActions';
import { RowProvider } from './RowContext';

const storageKey = 'containers';
const useStore = createStore(storageKey);

const actions = [
  buildAction('logs', '日志'),
  buildAction('inspect', '检查'),
  buildAction('stats', '状态'),
  buildAction('exec', '控制台'),
  buildAction('attach', '附加'),
];

export interface Props {
  isHostColumnVisible: boolean;
  environment: Environment;
}

export function ContainersDatatable({
  isHostColumnVisible,
  environment,
}: Props) {
  const settings = useStore();
  const isGPUsColumnVisible = useShowGPUsColumn(environment.Id);
  const columns = useColumns(isHostColumnVisible, isGPUsColumnVisible);
  const hidableColumns = _.compact(
    columns.filter((col) => col.canHide).map((col) => col.id)
  );

  const containersQuery = useContainers(
    environment.Id,
    true,
    undefined,
    settings.autoRefreshRate * 1000
  );

  return (
    <RowProvider context={{ environment }}>
      <Datatable
        titleOptions={{
          icon: 'svg-cubes',
          title: '容器',
        }}
        settingsStore={settings}
        columns={columns}
        renderTableActions={(selectedRows) => (
          <ContainersDatatableActions
            selectedItems={selectedRows}
            isAddActionVisible
            endpointId={environment.Id}
          />
        )}
        isLoading={containersQuery.isLoading}
        isRowSelectable={(row) => !row.original.IsPortainer}
        initialTableState={{ hiddenColumns: settings.hiddenColumns }}
        renderTableSettings={(tableInstance) => {
          const columnsToHide = tableInstance.allColumns.filter((colInstance) =>
            hidableColumns?.includes(colInstance.id)
          );

          return (
            <>
              <ColumnVisibilityMenu<DockerContainer>
                columns={columnsToHide}
                onChange={(hiddenColumns) => {
                  settings.setHiddenColumns(hiddenColumns);
                  tableInstance.setHiddenColumns(hiddenColumns);
                }}
                value={settings.hiddenColumns}
              />
              <TableSettingsMenu
                quickActions={<QuickActionsSettings actions={actions} />}
              >
                <ContainersDatatableSettings
                  isRefreshVisible
                  settings={settings}
                />
              </TableSettingsMenu>
            </>
          );
        }}
        storageKey={storageKey}
        dataset={containersQuery.data || []}
        emptyContentLabel="未找到容器"
      />
    </RowProvider>
  );
}
