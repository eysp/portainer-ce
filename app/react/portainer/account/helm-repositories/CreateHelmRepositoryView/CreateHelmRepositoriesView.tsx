import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody } from '@@/Widget';

import { CreateHelmRepositoryForm } from './CreateHelmRespositoriesForm';

export function CreateHelmRepositoriesView() {
  return (
    <>
      <PageHeader
        title="创建Helm仓库"
        breadcrumbs={[
          { label: '我的账户', link: 'portainer.account' },
          { label: '创建Helm仓库' },
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetBody>
              <CreateHelmRepositoryForm />
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}
