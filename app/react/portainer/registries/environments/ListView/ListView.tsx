import { PageHeader } from '@@/PageHeader';

import { EnvironmentRegistriesDatatable } from './EnvironmentRegistriesDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境注册表"
        breadcrumbs="注册表管理"
        reload
      />

      <EnvironmentRegistriesDatatable />
    </>
  );
}
