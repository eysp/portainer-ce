import { useQuery } from 'react-query';

import { error as notifyError } from '@/portainer/services/notifications';
import { getBackupStatus } from '@/portainer/services/api/backup.service';
import { isoDate } from '@/portainer/filters/filters';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

export function BackupFailedPanel() {
  const { status, isLoading } = useBackupStatus();

  if (isLoading || !status || !status.Failed) {
    return null;
  }

  return (
    <InformationPanel title="Information">
      <TextTip>
        最新的自动备份在 {isoDate(status.TimestampUTC)} 失败。
        请查看日志文件并检查 <Link to="portainer.settings">设置</Link> 来验证备份配置。
      </TextTip>
    </InformationPanel>
  );
}

function useBackupStatus() {
  const { data, isLoading } = useQuery(
    ['backup', 'status'],
    () => getBackupStatus(),
    {
      onError(error) {
        notifyError('失败', error as Error, '获取许可证信息失败');
      },
    }
  );

  return { status: data, isLoading };
}
