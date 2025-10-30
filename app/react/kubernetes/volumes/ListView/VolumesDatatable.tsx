import { Database } from 'lucide-react';

import { Authorized, useAuthorizations } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { refreshableSettings } from '@@/datatables/types';
import { Datatable, TableSettingsMenu } from '@@/datatables';
import { useTableStateWithStorage } from '@@/datatables/useTableState';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { systemResourcesSettings } from '../../datatables/SystemResourcesSettings';
import { CreateFromManifestButton } from '../../components/CreateFromManifestButton';
import {
  DefaultDatatableSettings,
  TableSettings,
} from '../../datatables/DefaultDatatableSettings';
import { SystemResourceDescription } from '../../datatables/SystemResourceDescription';
import { useNamespacesQuery } from '../../namespaces/queries/useNamespacesQuery';
import {
  convertToVolumeViewModels,
  useAllVolumesQuery,
} from '../queries/useVolumesQuery';
import { isSystemNamespace } from '../../namespaces/queries/useIsSystemNamespace';
import { useDeleteVolumes } from '../queries/useDeleteVolumes';
import { isVolumeUsed } from '../utils';
import { K8sVolumeInfo } from '../types';

import { columns } from './columns';
import { VolumeViewModel } from './types';

export function VolumesDatatable() {
  const tableState = useTableStateWithStorage<TableSettings>(
    'kube-volumes',
    'Name',
    (set) => ({
      ...systemResourcesSettings(set),
      ...refreshableSettings(set),
    })
  );

  const { authorized: hasWriteAuth } = useAuthorizations(
    'K8sVolumesW',
    undefined,
    false
  );

  const envId = useEnvironmentId();
  const deleteVolumesMutation = useDeleteVolumes(envId);
  const namespaceListQuery = useNamespacesQuery(envId);
  const namespaces = namespaceListQuery.data ?? [];
  const volumesQuery = useAllVolumesQuery(envId, {
    refetchInterval: tableState.autoRefreshRate * 1000,
    select: transformAndFilterVolumes,
  });
  const volumes = volumesQuery.data ?? [];

  return (
    <Datatable
      data-cy="k8s-volumes-datatable"
      isLoading={volumesQuery.isLoading || namespaceListQuery.isLoading}
      dataset={volumes}
      columns={columns}
      settingsManager={tableState}
      title="Volumes"
      titleIcon={Database}
      getRowId={(row) =>
        `${row.PersistentVolumeClaim.Name}-${row.ResourcePool.Namespace.Name}`
      }
      disableSelect={!hasWriteAuth}
      isRowSelectable={({ original: volume }) =>
        !isSystemNamespace(volume.ResourcePool.Namespace.Name, namespaces) &&
        !isVolumeUsed(volume)
      }
      renderTableActions={(selectedItems) => (
        <Authorized authorizations="K8sVolumesW">
          <DeleteButton
            confirmMessage="Do you want to remove the selected volume(s)?"
            onConfirmed={() => deleteVolumesMutation.mutate(selectedItems)}
            disabled={selectedItems.length === 0}
            isLoading={deleteVolumesMutation.isLoading}
            data-cy="k8s-volumes-delete-button"
          />
          <CreateFromManifestButton data-cy="k8s-volumes-deploy-button" />
        </Authorized>
      )}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <DefaultDatatableSettings settings={tableState} />
        </TableSettingsMenu>
      )}
      description={
        <SystemResourceDescription
          showSystemResources={tableState.showSystemResources}
        />
      }
    />
  );

  function transformAndFilterVolumes(
    volumes: K8sVolumeInfo[]
  ): VolumeViewModel[] {
    const transformedVolumes = convertToVolumeViewModels(volumes);
    return transformedVolumes.filter(
      (volume) =>
        tableState.showSystemResources ||
        !isSystemNamespace(volume.ResourcePool.Namespace.Name, namespaces)
    );
  }
}
