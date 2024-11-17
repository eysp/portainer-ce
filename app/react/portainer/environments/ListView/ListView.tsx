import { useStore } from 'zustand';

import { notifySuccess } from '@/portainer/services/notifications';
import { environmentStore } from '@/react/hooks/current-environment-store';

import { PageHeader } from '@@/PageHeader';
import { confirmDelete } from '@@/modals/confirm';

import { Environment } from '../types';

import { EnvironmentsDatatable } from './EnvironmentsDatatable';
import { useDeleteEnvironmentsMutation } from './useDeleteEnvironmentsMutation';

export function ListView() {
  const constCurrentEnvironmentStore = useStore(environmentStore);
  const deletionMutation = useDeleteEnvironmentsMutation();

  return (
    <>
      <PageHeader
        title="环境"
        breadcrumbs="环境管理"
        reload
      />

      <EnvironmentsDatatable onRemove={handleRemove} />
    </>
  );

  async function handleRemove(environmentsToDelete: Array<Environment>) {
    const confirmed = await confirmDelete(
      '此操作将删除与您的环境相关的所有配置。是否继续？'
    );

    if (!confirmed) {
      return;
    }

    const id = constCurrentEnvironmentStore.environmentId;
    // If the current endpoint was deleted, then clean endpoint store
    if (environmentsToDelete.some((e) => e.Id === id)) {
      constCurrentEnvironmentStore.clear();
    }

    deletionMutation.mutate(
      environmentsToDelete.map((e) => ({
        id: e.Id,
        deleteCluster: false,
        name: e.Name,
      })),
      {
        onSuccess() {
          notifySuccess(
            '环境成功删除',
            environmentsToDelete.map((e) => e.Name).join(', ')
          );
        },
      }
    );
  }
}
