import { PageHeader } from '@@/PageHeader';

import { EnvironmentRegistriesDatatable } from './EnvironmentRegistriesDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境镜像仓库"
        breadcrumbs="Registry management"
        reload
      />

      <EnvironmentRegistriesDatatable />
    </>
  );
}
