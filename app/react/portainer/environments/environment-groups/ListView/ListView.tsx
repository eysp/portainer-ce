import { PageHeader } from '@@/PageHeader';
import { AddButton } from '@@/buttons';

import { EnvironmentGroupsTable } from './EnvironmentGroupsTable/EnvironmentGroupsTable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="环境分组"
        breadcrumbs="环境分组管理"
        reload
      >
        <AddButton to=".new" data-cy="add-environment-group-button">
          添加分组
        </AddButton>
      </PageHeader>

      <div className="mx-5 mb-5">
        <EnvironmentGroupsTable />
      </div>
    </>
  );
}
