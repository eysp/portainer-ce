import { useCurrentStateAndParams } from '@uirouter/react';
import { filesize } from 'filesize';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

import { trimContainerName } from '@/docker/filters/utils';
import { ContainerStatsViewModel } from '@/docker/models/containerStats';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { StatsLineChart } from '@/react/components/Charts/StatsLineChart';

import { InformationPanel } from '@@/InformationPanel';
import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';

import { containerStats } from '../queries/useContainerStats';
import {
  useContainer,
  ContainerDetailsResponse,
} from '../queries/useContainer';

import { ProcessesDatatable } from './ProcessesDatatable';

const CHART_LIMIT = 600;
const REFRESH_RATES = [1, 3, 5, 10, 30, 60] as const;

const PRIMARY = '#97bbcd';
const SECONDARY = '#ffb4ae';

type ChartPoint = {
  time: string;
  cpu: number;
  memory: number;
  cache: number;
  rx: number;
  tx: number;
  ioRead: number;
  ioWrite: number;
};

function formatBytes(value: number): string {
  return value > 5
    ? filesize(value, { base: 10, round: 1 })
    : `${value.toFixed(1)}B`;
}

export function formatPercent(value: number): string {
  if (value >= 1) return `${Math.round(value)}%`;
  if (value >= 0.1) return `${value.toFixed(1)}%`;
  return `${value.toFixed(2)}%`;
}

export function calculateCpuPercent(stats: ContainerStatsViewModel): number {
  if (stats.isWindows) {
    const readMs = new Date(stats.read).getTime();
    const prereadMs = new Date(stats.preread).getTime();
    const possIntervals = stats.NumProcs * (readMs - prereadMs);
    if (possIntervals > 0) {
      return (
        (stats.CurrentCPUTotalUsage - stats.PreviousCPUTotalUsage) /
        (possIntervals * 100)
      );
    }
    return 0;
  }
  const cpuDelta = stats.CurrentCPUTotalUsage - stats.PreviousCPUTotalUsage;
  const systemDelta =
    stats.CurrentCPUSystemUsage - stats.PreviousCPUSystemUsage;
  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * stats.CPUCores * 100;
  }
  return 0;
}

export function StatsView() {
  const environmentId = useEnvironmentId();
  const {
    params: { id: containerId, nodeName },
  } = useCurrentStateAndParams();

  const [refreshRate, setRefreshRate] = useState(5);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [networkUnavailable, setNetworkUnavailable] = useState(false);
  const [ioUnavailable, setIoUnavailable] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const networkUnavailableRef = useRef(false);
  const ioUnavailableRef = useRef(false);

  const containerQuery = useContainer<ContainerDetailsResponse>({
    environmentId,
    containerId,
    nodeName,
  });
  const containerName = trimContainerName(containerQuery.data?.Name);

  useEffect(() => {
    let active = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    async function doFetch() {
      try {
        const raw = await containerStats(environmentId, containerId, nodeName);
        if (!active) return;

        const stats = new ContainerStatsViewModel(raw);

        if (!networkUnavailableRef.current && stats.Networks.length === 0) {
          networkUnavailableRef.current = true;
          setNetworkUnavailable(true);
        }
        if (!ioUnavailableRef.current && stats.noIOdata) {
          ioUnavailableRef.current = true;
          setIoUnavailable(true);
        }

        const point: ChartPoint = {
          time: moment(stats.read).format('HH:mm:ss'),
          cpu: calculateCpuPercent(stats),
          memory: stats.MemoryUsage,
          cache: stats.MemoryCache,
          rx: stats.Networks[0]?.rx_bytes ?? 0,
          tx: stats.Networks[0]?.tx_bytes ?? 0,
          ioRead: stats.BytesRead,
          ioWrite: stats.BytesWrite,
        };

        setFetchError(null);
        setChartData((prev) => {
          const next = [...prev, point];
          return next.length > CHART_LIMIT ? next.slice(1) : next;
        });
      } catch (err) {
        if (!active) return;
        setFetchError(
          err instanceof Error
            ? err.message
            : 'Unable to retrieve container statistics'
        );
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }

    doFetch();
    intervalId = setInterval(doFetch, refreshRate * 1000);
    return () => {
      active = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [environmentId, containerId, nodeName, refreshRate]);

  return (
    <>
      <PageHeader
        title="容器实时统计"
        breadcrumbs={[
          { label: '容器列表', link: 'docker.containers' },
          {
            label: containerName || containerId,
            link: 'docker.containers.container',
            linkParams: { id: containerId },
          },
          '统计',
        ]}
      />

      <div className="row">
        <div className="col-md-12">
          <Widget>
            <WidgetTitle icon="info" title="关于实时统计" />
            <WidgetBody>
              <form className="form-horizontal">
                <div className="form-group">
                  <div className="col-sm-12">
                    <span className="small text-muted">
                      此视图显示容器 <b>{containerName}</b> 的实时运行统计信息以及该容器内正在运行的进程列表。
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="refreshRate"
                    className="col-sm-3 col-md-2 control-label text-left"
                  >
                    刷新频率
                  </label>
                  <div className="col-sm-3 col-md-2">
                    <select
                      id="refreshRate"
                      className="form-control"
                      value={refreshRate}
                      onChange={(e) => setRefreshRate(Number(e.target.value))}
                      data-cy="docker-containers-stats-refresh-rate"
                    >
                      {REFRESH_RATES.map((r) => (
                        <option key={r} value={r}>
                          {r}s
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {networkUnavailable && (
                  <div className="form-group">
                    <div className="col-sm-12">
                      <span className="small text-muted">
                        此容器的网络统计不可用。
                      </span>
                    </div>
                  </div>
                )}
                {ioUnavailable && (
                  <div className="form-group">
                    <div className="col-sm-12">
                      <span className="small text-muted">
                        此容器的 I/O 读写统计不可用。
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </WidgetBody>
          </Widget>
        </div>
      </div>

      {fetchError && (
        <InformationPanel title="无法获取容器统计信息">
          <span className="small text-danger">{fetchError}</span>
        </InformationPanel>
      )}

      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Widget>
            <WidgetTitle icon="bar-chart-2" title="内存使用量" />
            <WidgetBody>
              <StatsLineChart
                data={chartData}
                series={[
                  {
                    dataKey: 'memory',
                    name: '内存 (Memory)',
                    color: PRIMARY,
                    area: true,
                    stackId: 'mem',
                  },
                  {
                    dataKey: 'cache',
                    name: '缓存 (Cache)',
                    color: SECONDARY,
                    area: true,
                    stackId: 'mem',
                  },
                ]}
                yAxisFormatter={formatBytes}
                yAxisDomain={['auto', 'auto']}
              />
            </WidgetBody>
          </Widget>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <Widget>
            <WidgetTitle icon="bar-chart-2" title="CPU 使用率" />
            <WidgetBody>
              <StatsLineChart
                data={chartData}
                series={[
                  {
                    dataKey: 'cpu',
                    name: 'CPU',
                    color: PRIMARY,
                    area: true,
                  },
                ]}
                yAxisFormatter={formatPercent}
              />
            </WidgetBody>
          </Widget>
        </div>

        {!networkUnavailable && (
          <div className="col-lg-6 col-md-6 col-sm-12">
            <Widget>
              <WidgetTitle
                icon="bar-chart-2"
                title="网络流量统计 (聚合)"
              />
              <WidgetBody>
                <StatsLineChart
                  data={chartData}
                  series={[
                    { dataKey: 'rx', name: '接收 (RX)', color: PRIMARY },
                    { dataKey: 'tx', name: '发送 (TX)', color: SECONDARY },
                  ]}
                  yAxisFormatter={formatBytes}
                />
              </WidgetBody>
            </Widget>
          </div>
        )}

        {!ioUnavailable && (
          <div className="col-lg-6 col-md-6 col-sm-12">
            <Widget>
              <WidgetTitle icon="bar-chart-2" title="I/O 读写统计 (聚合)" />
              <WidgetBody>
                <StatsLineChart
                  data={chartData}
                  series={[
                    {
                      dataKey: 'ioRead',
                      name: '读取 (聚合)',
                      color: PRIMARY,
                      area: true,
                      stackId: 'io',
                    },
                    {
                      dataKey: 'ioWrite',
                      name: '写入 (聚合)',
                      color: SECONDARY,
                      area: true,
                      stackId: 'io',
                    },
                  ]}
                  yAxisFormatter={formatBytes}
                />
              </WidgetBody>
            </Widget>
          </div>
        )}
      </div>

      <ProcessesDatatable />
    </>
  );
}
