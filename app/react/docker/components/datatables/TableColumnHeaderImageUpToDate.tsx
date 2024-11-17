import UpdatesAvailable from '@/assets/ico/icon_updates-available.svg?c';
import UpToDate from '@/assets/ico/icon_up-to-date.svg?c';
import UpdatesUnknown from '@/assets/ico/icon_updates-unknown.svg?c';
import { useEnvironment } from '@/react/portainer/environments/queries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { Icon } from '@@/Icon';
import { Tooltip } from '@@/Tip/Tooltip';
import {
  TableColumnHeaderAngular,
  TableColumnHeaderAngularProps,
} from '@@/datatables/TableHeaderCell';

export function TableColumnHeaderImageUpToDate({
  canSort,
  isSorted,
  colTitle,
  isSortedDesc = true,
}: TableColumnHeaderAngularProps) {
  return (
    <TableColumnHeaderAngular
      canSort={canSort}
      isSorted={isSorted}
      colTitle={colTitle}
      isSortedDesc={isSortedDesc}
    >
      <ImageUpToDateTooltip />
    </TableColumnHeaderAngular>
  );
}

export function ImageUpToDateTooltip() {
  const environmentId = useEnvironmentId();

  const enableImageNotificationQuery = useEnvironment(
    environmentId,
    (environment) => environment?.EnableImageNotification
  );

  if (!enableImageNotificationQuery.data) {
    return null;
  }

  if (!isBE) {
    return null;
  }

  return (
    <Tooltip
      position="top"
      message={
        <div className="flex flex-col gap-y-2 p-2">
          <div className="flex items-center gap-2">
            <Icon icon={UpToDate} />
            镜像是最新的
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={UpdatesAvailable} />
            有可用的更新
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={UpdatesUnknown} />
            更新可用性未知
          </div>
        </div>
      }
    />
  );
}
