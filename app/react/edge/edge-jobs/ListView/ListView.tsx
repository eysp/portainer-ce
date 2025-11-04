import { InformationPanel } from '@@/InformationPanel';
import { PageHeader } from '@@/PageHeader';

import { EdgeJobsDatatable } from './EdgeJobsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="边缘作业" breadcrumbs="边缘作业" reload />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel title="信息">
            <p className="small text-muted">
              边缘作业需要 Docker Standalone 和从 <code>/etc/cron.d</code> 读取作业的 cron 实现
            </p>
          </InformationPanel>
        </div>
      </div>

      <EdgeJobsDatatable />
    </>
  );
}
