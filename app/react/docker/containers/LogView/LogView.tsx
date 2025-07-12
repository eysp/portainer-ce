import { useCurrentStateAndParams } from '@uirouter/react';

import { useContainer } from '@/react/docker/containers/queries/useContainer';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

export function LogView() {
  const {
    params: { endpointId: environmentId, id: containerId, nodeName },
  } = useCurrentStateAndParams();

  const containerQuery = useContainer(environmentId, containerId, nodeName);
  if (!containerQuery.data || containerQuery.isLoading) {
    return null;
  }

  const logsEnabled =
    containerQuery.data.HostConfig?.LogConfig?.Type && // if a portion of the object path doesn't exist, logging is likely disabled
    containerQuery.data.HostConfig.LogConfig.Type !== 'none'; // if type === none logging is disabled

  return <>{!logsEnabled && <LogsDisabledInfoPanel />}</>;
}

function LogsDisabledInfoPanel() {
  const {
    params: { id: containerId, nodeName },
  } = useCurrentStateAndParams();

  return (
    <div className="row">
      <div className="col-sm-12">
        <InformationPanel>
          <TextTip color="blue">
            此容器已禁用日志记录。如果你想重新启用日志记录，请{' '}
            <Link
              to="docker.containers.new"
              params={{ from: containerId, nodeName }}
              data-cy="redeploy-container-link"
            >
              重新部署你的容器
            </Link>{' '}
            并在“命令与日志”面板中选择一个日志驱动程序。
          </TextTip>
        </InformationPanel>
      </div>
    </div>
  );
}
