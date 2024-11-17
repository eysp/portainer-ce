import { useRouter, useCurrentStateAndParams } from '@uirouter/react';
import { useQueryClient } from 'react-query';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { AccessControlPanel } from '@/react/portainer/access-control/AccessControlPanel/AccessControlPanel';
import { ResourceControlType } from '@/react/portainer/access-control/types';
import { ContainerListViewModel } from '@/react/docker/containers/types';
import { ResourceControlViewModel } from '@/react/portainer/access-control/models/ResourceControlViewModel';
import { useContainers } from '@/react/docker/containers/queries/useContainers';
import { notifySuccess } from '@/portainer/services/notifications';

import { confirmDelete } from '@@/modals/confirm';
import { PageHeader } from '@@/PageHeader';

import { useDeleteNetwork } from '../queries/useDeleteNetworkMutation';
import { isSystemNetwork } from '../network.helper';
import { NetworkResponseContainers } from '../types';
import { queryKeys } from '../queries/queryKeys';
import { useNetwork } from '../queries/useNetwork';

import { NetworkDetailsTable } from './NetworkDetailsTable';
import { NetworkOptionsTable } from './NetworkOptionsTable';
import { NetworkContainersTable } from './NetworkContainersTable';

export function ItemView() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    params: { id: networkId, nodeName },
  } = useCurrentStateAndParams();
  const environmentId = useEnvironmentId();
  const networkQuery = useNetwork(environmentId, networkId, { nodeName });
  const deleteNetworkMutation = useDeleteNetwork(environmentId);
  const containersQuery = useContainers(environmentId, {
    filters: {
      network: [networkId],
    },
    nodeName,
  });

  if (!networkQuery.data) {
    return null;
  }

  const network = networkQuery.data;

  const networkContainers = filterContainersInNetwork(
    network.Containers,
    containersQuery.data
  );
  const resourceControl = network.Portainer?.ResourceControl
    ? new ResourceControlViewModel(network.Portainer.ResourceControl)
    : undefined;

  return (
    <>
      <PageHeader
        title="网络详情"
        breadcrumbs={[
          { link: 'docker.networks', label: '网络' },
          {
            link: 'docker.networks.network',
            label: networkQuery.data.Name,
          },
        ]}
        reload
      />
      <NetworkDetailsTable
        network={networkQuery.data}
        onRemoveNetworkClicked={onRemoveNetworkClicked}
      />

      <AccessControlPanel
        onUpdateSuccess={() =>
          queryClient.invalidateQueries(
            queryKeys.item(environmentId, networkId)
          )
        }
        resourceControl={resourceControl}
        resourceType={ResourceControlType.Network}
        disableOwnershipChange={isSystemNetwork(networkQuery.data.Name)}
        resourceId={networkId}
        environmentId={environmentId}
      />
      <NetworkOptionsTable options={networkQuery.data.Options} />
      <NetworkContainersTable
        networkContainers={networkContainers}
        nodeName={nodeName}
        environmentId={environmentId}
        networkId={networkId}
      />
    </>
  );

  async function onRemoveNetworkClicked() {
    const message = '您确定要删除此网络吗？?';
    const confirmed = await confirmDelete(message);

    if (confirmed) {
      deleteNetworkMutation.mutate(
        { networkId, nodeName },
        {
          onSuccess: () => {
            notifySuccess('网络已成功删除', networkId);
            router.stateService.go('docker.networks');
          },
        }
      );
    }
  }
}

function filterContainersInNetwork(
  networkContainers?: NetworkResponseContainers,
  containers: ContainerListViewModel[] = []
) {
  if (!networkContainers) {
    return [];
  }

  return containers
    .filter((container) => networkContainers[container.Id])
    .map((container) => ({
      ...networkContainers[container.Id],
      Id: container.Id,
    }));
}
