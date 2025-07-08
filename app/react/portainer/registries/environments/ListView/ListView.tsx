import { PageHeader } from '@@/PageHeader';

import { EnvironmentRegistriesDatatable } from './EnvironmentRegistriesDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境镜像仓库"
        breadcrumbs="镜像仓库管理"
        reload
      />

      <EnvironmentRegistriesDatatable />
    </>
  );
}
