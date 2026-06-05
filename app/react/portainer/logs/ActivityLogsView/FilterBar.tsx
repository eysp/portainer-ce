import { DownloadIcon } from 'lucide-react';

import { Widget } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';
import { Button } from '@@/buttons';

import { DateRangePicker } from '../components/DateRangePicker';

export function FilterBar({
  value,
  onChange,
  onExport,
}: {
  value: { start: Date; end: Date | null } | undefined;
  onChange: (value?: { start: Date; end: Date | null }) => void;
  onExport: () => void;
}) {
  return (
    <Widget>
      <Widget.Body>
        <form className="form-horizontal">
          <DateRangePicker value={value} onChange={onChange} />

          <TextTip color="blue">
            Portainer 用户活动日志的最长保留时间为 7 天。
          </TextTip>

          <div className="mt-4">
            <Button
              color="primary"
              icon={DownloadIcon}
              onClick={onExport}
              className="!ml-0"
              data-cy="activity-logs-export-csv-button"
            >
              导出为 CSV
            </Button>
          </div>
        </form>
      </Widget.Body>
    </Widget>
  );
}
