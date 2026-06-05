import { PageHeader } from '@@/PageHeader';

import { EnvironmentGroupsDatatable } from './EnvironmentGroupsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境组"
        breadcrumbs="Environment group management"
        reload
      />

      <EnvironmentGroupsDatatable />
    </>
  );
}
