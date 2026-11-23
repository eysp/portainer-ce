import { PageHeader } from '@@/PageHeader';

import { useDeleteNetworkListMutation } from '../queries/useDeleteNetworkListMutation';

import { NetworksDatatable } from './NetworksDatatable';

export function ListView() {
  const removeMutation = useDeleteNetworkListMutation();

  return (
    <>
      <PageHeader title="网络列表" breadcrumbs={['网络列表']} reload />

      <NetworksDatatable
        onRemove={(networks) => removeMutation.mutate({ networks })}
      />
    </>
  );
}
