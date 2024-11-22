import {
  ChevronDown,
  Download,
  List,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuPopover } from '@reach/menu-button';
import { positionRight } from '@reach/popover';
import { useMemo } from 'react';

import { Authorized } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { Datatable, TableSettingsMenu } from '@@/datatables';
import {
  BasicTableSettings,
  createPersistedStore,
  refreshableSettings,
  RefreshableTableSettings,
} from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { Button, ButtonGroup, LoadingButton } from '@@/buttons';
import { Link } from '@@/Link';
import { ButtonWithRef } from '@@/buttons/Button';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';

import { ImagesListResponse, useImages } from '../../queries/useImages';

import { columns as defColumns } from './columns';
import { host as hostColumn } from './columns/host';

const tableKey = 'images';

export interface TableSettings
  extends BasicTableSettings,
    RefreshableTableSettings {}

const settingsStore = createPersistedStore<TableSettings>(
  tableKey,
  'tags',
  (set) => ({
    ...refreshableSettings(set),
  })
);

export function ImagesDatatable({
  isHostColumnVisible,
  isExportInProgress,
  onDownload,
  onRemove,
}: {
  isHostColumnVisible: boolean;

  onDownload: (images: Array<ImagesListResponse>) => void;
  onRemove: (images: Array<ImagesListResponse>, force: true) => void;
  isExportInProgress: boolean;
}) {
  const environmentId = useEnvironmentId();
  const tableState = useTableState(settingsStore, tableKey);
  const columns = useMemo(
    () => (isHostColumnVisible ? [...defColumns, hostColumn] : defColumns),
    [isHostColumnVisible]
  );
  const imagesQuery = useImages(environmentId, true, {
    refetchInterval: tableState.autoRefreshRate * 1000,
  });

  return (
    <Datatable
      title="镜像"
      titleIcon={List}
      renderTableActions={(selectedItems) => (
        <div className="flex items-center gap-2">
          <RemoveButtonMenu selectedItems={selectedItems} onRemove={onRemove} />

          <ImportExportButtons
            isExportInProgress={isExportInProgress}
            onExportClick={onDownload}
            selectedItems={selectedItems}
          />

          <Authorized authorizations="DockerImageBuild">
            <Button
              as={Link}
              props={{ to: 'docker.images.build' }}
              data-cy="image-buildImageButton"
              icon={Plus}
            >
              构建新镜像
            </Button>
          </Authorized>
        </div>
      )}
      dataset={imagesQuery.data || []}
      isLoading={imagesQuery.isLoading}
      settingsManager={tableState}
      columns={columns}
      emptyContentLabel="未找到镜像"
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRate}
            onChange={(value) => tableState.setAutoRefreshRate(value)}
          />
        </TableSettingsMenu>
      )}
    />
  );
}

function RemoveButtonMenu({
  onRemove,
  selectedItems,
}: {
  selectedItems: Array<ImagesListResponse>;
  onRemove(selectedItems: Array<ImagesListResponse>, force: boolean): void;
}) {
  return (
    <Authorized authorizations="DockerImageDelete">
      <ButtonGroup>
        <Button
          size="small"
          color="dangerlight"
          icon={Trash2}
          disabled={selectedItems.length === 0}
          data-cy="image-removeImageButton"
          onClick={() => {
            onRemove(selectedItems, false);
          }}
        >
          删除
        </Button>
        <Menu>
          <MenuButton
            as={ButtonWithRef}
            size="small"
            color="dangerlight"
            disabled={selectedItems.length === 0}
            icon={ChevronDown}
          >
            <span className="sr-only">Toggle Dropdown</span>
          </MenuButton>
          <MenuPopover position={positionRight}>
            <div className="mt-3 bg-white th-highcontrast:bg-black th-dark:bg-black">
              <MenuItem
                onSelect={() => {
                  onRemove(selectedItems, true);
                }}
              >
                强制删除
              </MenuItem>
            </div>
          </MenuPopover>
        </Menu>
      </ButtonGroup>
    </Authorized>
  );
}

function ImportExportButtons({
  isExportInProgress,
  selectedItems,
  onExportClick,
}: {
  isExportInProgress: boolean;
  selectedItems: Array<ImagesListResponse>;
  onExportClick(selectedItems: Array<ImagesListResponse>): void;
}) {
  return (
    <ButtonGroup>
      <Authorized authorizations="DockerImageLoad">
        <Button
          size="small"
          color="light"
          as={Link}
          data-cy="image-importImageButton"
          icon={Upload}
          disabled={isExportInProgress}
          props={{ to: 'docker.images.import' }}
        >
          导入
        </Button>
      </Authorized>
      <Authorized authorizations="DockerImageGet">
        <LoadingButton
          size="small"
          color="light"
          icon={Download}
          isLoading={isExportInProgress}
          loadingText="Export in progress..."
          data-cy="image-exportImageButton"
          onClick={() => onExportClick(selectedItems)}
          disabled={selectedItems.length === 0}
        >
          导出
        </LoadingButton>
      </Authorized>
    </ButtonGroup>
  );
}
