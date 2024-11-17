import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody } from '@@/Widget';

import { CreateContainerInstanceForm } from './CreateContainerInstanceForm';

export function CreateView() {
  return (
    <>
      <PageHeader
        title="创建容器实例"
        breadcrumbs={[
          { link: 'azure.containerinstances', label: '容器实例' },
          { label: '添加容器' },
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetBody>
              <CreateContainerInstanceForm />
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}
