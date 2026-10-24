import { useRouter } from '@uirouter/react';

import { humanize } from '@/portainer/filters/filters';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { Widget } from '@@/Widget/Widget';
import { WidgetBody } from '@@/Widget/WidgetBody';
import { WidgetTitle } from '@@/Widget/WidgetTitle';
import { DetailsTable } from '@@/DetailsTable/DetailsTable';
import { Tooltip } from '@@/Tip/Tooltip';

import { DockerStorageInfo } from '../DockerStorageInfo';

type HostOs = {
  type: string;
  arch: string;
  name: string;
};

type HostInfo = {
  name: string;
  os?: HostOs;
  kernelVersion?: string;
  totalCPU: number;
  totalMemory: number;
};

type Props = {
  host: HostInfo;
  isBrowseEnabled: boolean;
  browseUrl: string;
  endpointId?: EnvironmentId;
};

export function HostDetailsPanel({
  host,
  isBrowseEnabled,
  browseUrl,
  endpointId,
}: Props) {
  const router = useRouter();

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <Widget>
          <WidgetTitle title="主机详情" icon="code" />
          <WidgetBody className="no-padding">
            <DetailsTable dataCy="host-details" className="!mb-0">
              <tr>
                <td>主机名</td>
                <td>{host.name}</td>
              </tr>
              {host.os && (
                <tr>
                  <td>操作系统信息</td>
                  <td>
                    {host.os.type} {host.os.arch} {host.os.name}
                  </td>
                </tr>
              )}
              {host.kernelVersion && (
                <tr>
                  <td>内核版本</td>
                  <td>{host.kernelVersion}</td>
                </tr>
              )}
              <tr>
                <td>总 CPU</td>
                <td>{host.totalCPU}</td>
              </tr>
              <tr>
                <td>总内存</td>
                <td>{humanize(host.totalMemory)}</td>
              </tr>
              {endpointId && (
                <tr>
                  <td>
                    <span className="flex items-center">
                      磁盘使用
                      <Tooltip message="支持 Docker 数据目录的分区上的磁盘使用情况。Docker 使用量包括镜像、容器层、卷和构建缓存。" />
                    </span>
                  </td>
                  <td>
                    <DockerStorageInfo endpointId={endpointId} />
                  </td>
                </tr>
              )}
              {isBrowseEnabled && (
                <tr>
                  <td colSpan={2}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      title="浏览"
                      onClick={() => router.stateService.go(browseUrl)}
                    >
                      浏览
                    </button>
                  </td>
                </tr>
              )}
            </DetailsTable>
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
