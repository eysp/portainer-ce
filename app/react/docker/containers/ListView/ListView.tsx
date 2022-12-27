import { useInfo } from '@/docker/services/system.service';
import { Environment } from '@/portainer/environments/types';
import { isAgentEnvironment } from '@/portainer/environments/utils';

import { PageHeader } from '@@/PageHeader';

import { ContainersDatatable } from './ContainersDatatable';

interface Props {
  endpoint: Environment;
}

export function ListView({ endpoint: environment }: Props) {
  const isAgent = isAgentEnvironment(environment.Type);

  const envInfoQuery = useInfo(environment.Id, (info) => !!info.Swarm?.NodeID);

  const isSwarmManager = !!envInfoQuery.data;
  const isHostColumnVisible = isAgent && isSwarmManager;
  return (
    <>
      <PageHeader
        title="容器列表"
        breadcrumbs={[{ label: '容器' }]}
        reload
      />

      <ContainersDatatable
        isHostColumnVisible={isHostColumnVisible}
        environment={environment}
      />
    </>
  );
}
