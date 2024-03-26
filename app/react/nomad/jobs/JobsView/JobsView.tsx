import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { PageHeader } from '@@/PageHeader';

import { useJobs } from './useJobs';
import { JobsDatatable } from './JobsDatatable';

export function JobsView() {
  const environmentId = useEnvironmentId();
  const jobsQuery = useJobs(environmentId);

  async function reloadData() {
    await jobsQuery.refetch();
  }

  return (
    <>
      <PageHeader
        title="Nomad 作业列表"
        breadcrumbs={[{ label: 'Nomad 作业' }]}
        reload
        loading={jobsQuery.isLoading}
        onReload={reloadData}
      />

      <JobsDatatable
        jobs={jobsQuery.data || []}
        refreshData={reloadData}
        isLoading={jobsQuery.isLoading}
      />
    </>
  );
}
