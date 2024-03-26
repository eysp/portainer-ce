import { TextTip } from '@@/Tip/TextTip';
import { InformationPanel } from '@@/InformationPanel';

import { useNodesCount } from '../system/useNodesCount';
import { useLicenseInfo } from '../licenses/use-license.service';
import { LicenseType } from '../licenses/types';

export function LicenseNodePanel() {
  const nodesValid = useNodesValid();

  if (nodesValid) {
    return null;
  }

  return (
    <InformationPanel title="许可节点允许超出">
      <TextTip>
        超出了您许可证的节点数量。请联系您的管理员。
      </TextTip>
    </InformationPanel>
  );
}

function useNodesValid() {
  const { isLoading: isLoadingNodes, data: nodesCount = 0 } = useNodesCount();

  const { isLoading: isLoadingLicense, info } = useLicenseInfo();
  if (
    isLoadingLicense ||
    isLoadingNodes ||
    !info ||
    info.type === LicenseType.Trial
  ) {
    return true;
  }

  return nodesCount <= info.nodes;
}
