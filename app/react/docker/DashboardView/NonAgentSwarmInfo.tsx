import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useInfoPanelState } from '@/react/hooks/useInfoPanelState';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { HelpLink } from '@@/HelpLink';

import { useInfo } from '../proxy/queries/useInfo';

const infoPanelId = 'docker-dashboard-info-01';

export function NonAgentSwarmInfo() {
  const { isVisible, dismiss } = useInfoPanelState(infoPanelId);
  const envId = useEnvironmentId();
  const isManagerQuery = useInfo(envId, {
    select: (info) => !!info.Swarm?.ControlAvailable,
  });
  if (!isVisible || isManagerQuery.isLoading) {
    return null;
  }

  const isManager = isManagerQuery.data;

  return (
    <InformationPanel title="信息" onDismiss={() => dismiss()}>
      <TextTip color="blue">
        {isManager ? (
          <>
            Portainer 已连接到属于 Swarm 集群一部分的节点。位于集群中其他节点上的一些资源可能无法进行管理，请查看{' '}
            <HelpLink
              docLink="/admin/environments/add/swarm/agent"
              target="_blank"
            >
              我们的 Agent 安装指南
            </HelpLink>{' '}
            获取更多详情。
          </>
        ) : (
          <>
            Portainer 已连接到一个工作(Worker)节点。Swarm 管理功能将不可用。
          </>
        )}
      </TextTip>
    </InformationPanel>
  );
}
