import { useQuery } from '@tanstack/react-query';

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
    <div className="row">
  <div className="col-sm-12">
    <InformationPanel title="信息">
      <TextTip>
        最近的自动备份于{' '}
        {isoDate(status.TimestampUTC)}失败。详情请查看日志文件，
        并查看{' '}
        <Link to="portainer.settings" data-cy="backup-failed-settings-link">
          设置
        </Link>{' '}
        以验证备份配置。
      </TextTip>
    </InformationPanel>
  </div>
</div>
  );
}

function useBackupStatus() {
  const { data, isLoading } = useQuery(
    ['backup', 'status'],
    () => getBackupStatus(),
    {
      onError(error) {
        notifyError('失败', error as Error, '获取许可信息失败');
      },
    }
  );

  return { status: data, isLoading };
}
