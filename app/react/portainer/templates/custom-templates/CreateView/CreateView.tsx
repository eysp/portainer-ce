import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { useViewType } from '../useViewType';

import { CreateForm } from './CreateForm';

export function CreateView() {
  const viewType = useViewType();
  const environmentId = useEnvironmentId(false);

  return (
    <div>
      <PageHeader
        title="创建自定义模板"
        breadcrumbs={[
          { label: '自定义模板', link: '^' },
          '创建自定义模板',
        ]}
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <CreateForm viewType={viewType} environmentId={environmentId} />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </div>
  );
}
