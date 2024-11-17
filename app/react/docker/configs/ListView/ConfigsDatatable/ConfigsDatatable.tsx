import { Clipboard, Plus, Trash2 } from 'lucide-react';

import { Authorized, useAuthorizations } from '@/react/hooks/useUser';

import { Datatable, TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { useRepeater } from '@@/datatables/useRepeater';
import { Button } from '@@/buttons';
import { Link } from '@@/Link';
import { useTableState } from '@@/datatables/useTableState';

import { DockerConfig } from '../../types';

import { columns } from './columns';
import { createStore } from './store';

interface Props {
  dataset: Array<DockerConfig>;
  onRemoveClick: (configs: Array<DockerConfig>) => void;
  onRefresh: () => Promise<void>;
}

const storageKey = 'docker_configs';
const settingsStore = createStore(storageKey);

export function ConfigsDatatable({ dataset, onRefresh, onRemoveClick }: Props) {
  const tableState = useTableState(settingsStore, storageKey);

  useRepeater(tableState.autoRefreshRate, onRefresh);

  const hasWriteAccessQuery = useAuthorizations([
    'DockerConfigCreate',
    'DockerConfigDelete',
  ]);

  return (
    <Datatable
      dataset={dataset}
      columns={columns}
      settingsManager={tableState}
      title="配置"
      titleIcon={Clipboard}
      emptyContentLabel="没有可用的配置。"
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRate}
            onChange={(value) => tableState.setAutoRefreshRate(value)}
          />
        </TableSettingsMenu>
      )}
      disableSelect={!hasWriteAccessQuery.authorized}
      renderTableActions={(selectedRows) =>
        hasWriteAccessQuery.authorized && (
          <div className="flex items-center gap-3">
            <Authorized authorizations="DockerConfigDelete">
              <Button
                icon={Trash2}
                color="dangerlight"
                onClick={() => onRemoveClick(selectedRows)}
                disabled={selectedRows.length === 0}
              >
                删除
              </Button>
            </Authorized>

            <Authorized authorizations="DockerConfigCreate">
              <Button
                icon={Plus}
                as={Link}
                props={{ to: 'docker.configs.new' }}
              >
                添加配置
              </Button>
            </Authorized>
          </div>
        )
      }
    />
  );
}
