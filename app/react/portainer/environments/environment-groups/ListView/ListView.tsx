import { PageHeader } from '@@/PageHeader';

import { EnvironmentGroupsDatatable } from './EnvironmentGroupsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境分组"
        breadcrumbs="环境分组管理"
        reload
      />

      <EnvironmentGroupsDatatable />
    </>
  );
}
