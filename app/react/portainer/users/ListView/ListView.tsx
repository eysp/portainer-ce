import { PageHeader } from '@@/PageHeader';

import { NewUserForm } from './NewUserForm/NewUserForm';
import { UsersDatatable } from './UsersDatatable/UsersDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="用户" breadcrumbs="用户管理" reload />

      <NewUserForm />

      <UsersDatatable />
    </>
  );
}
