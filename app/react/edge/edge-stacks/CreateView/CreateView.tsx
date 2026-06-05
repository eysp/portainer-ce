import { PageHeader } from '@@/PageHeader';

import { CreateForm } from './CreateForm';

export function CreateView() {
  return (
    <>
      <PageHeader
        title="创建边缘堆栈"
        breadcrumbs={[
          { label: '边缘堆栈', link: 'edge.stacks' },
          'Create Edge Stack',
        ]}
        reload
      />

      <CreateForm />
    </>
  );
}
