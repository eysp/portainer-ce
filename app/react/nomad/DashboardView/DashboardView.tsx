import { List, Settings, Boxes, Gauge } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { DashboardItem } from '@@/DashboardItem';
import { Widget, WidgetTitle, WidgetBody } from '@@/Widget';
import { PageHeader } from '@@/PageHeader';
import { DashboardGrid } from '@@/DashboardItem/DashboardGrid';
import { Icon } from '@@/Icon';

import { useDashboard } from './useDashboard';
import { RunningStatus } from './RunningStatus';

export function DashboardView() {
  const environmentId = useEnvironmentId();
  const dashboardQuery = useDashboard(environmentId);

  const running = dashboardQuery.data?.RunningTaskCount || 0;
  const stopped = (dashboardQuery.data?.TaskCount || 0) - running;

  return (
    <>
      <PageHeader
        title="仪表盘"
        breadcrumbs={[{ label: '环境概览' }]}
      />

      {dashboardQuery.isLoading ? (
        <div className="text-center" style={{ marginTop: '30%' }}>
          正在连接到Edge环境...
          <Icon icon={Settings} className="!ml-1 animate-spin-slow" />
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-sm-12">
              {/* cluster info */}
              <Widget>
                <WidgetTitle icon={Gauge} title="Cluster information" />
                <WidgetBody className="no-padding">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>集群中的节点数</td>
                        <td>{dashboardQuery.data?.NodeCount ?? '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </WidgetBody>
              </Widget>
            </div>
          </div>

          <div className="mx-4">
            <DashboardGrid>
              {/* jobs */}
              <DashboardItem
                value={dashboardQuery.data?.JobCount}
                icon={List}
                type="Nomad Job"
              />
              {/* groups */}
              <DashboardItem
                value={dashboardQuery.data?.GroupCount}
                icon={List}
                type="Group"
              />
              {/* tasks */}
              <DashboardItem
                value={dashboardQuery.data?.TaskCount}
                icon={Boxes}
                type="Task"
              >
                {/* running status of tasks */}
                <RunningStatus running={running} stopped={stopped} />
              </DashboardItem>
            </DashboardGrid>
          </div>
        </>
      )}
    </>
  );
}
