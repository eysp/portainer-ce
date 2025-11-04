import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@@/PageHeader';

import { queryKeys } from '../queries/query-keys';

import { EdgeStacksDatatable } from './EdgeStacksDatatable';

export function ListView() {
  const queryClient = useQueryClient();

  return (
    <>
      <PageHeader
        title="边缘堆栈列表"
        breadcrumbs="边缘堆栈"
        reload
        onReload={() => queryClient.invalidateQueries(queryKeys.base())}
      />

      <EdgeStacksDatatable />
    </>
  );
}
