import { PageHeader } from '@@/PageHeader';

import { ConfigsDatatable } from './ConfigsDatatable/ConfigsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="配置列表" breadcrumbs="配置" reload />

      <ConfigsDatatable />
    </>
  );
}
