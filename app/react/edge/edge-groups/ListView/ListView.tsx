import { PageHeader } from '@@/PageHeader';

import { EdgeGroupsDatatable } from './EdgeGroupsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="边缘分组" breadcrumbs="边缘分组" reload />
      <EdgeGroupsDatatable />
    </>
  );
}
