import { addPlural } from '@/react/common/string-utils';

interface SelectedRowsCountProps {
  value: number;
  hidden: number;
}

export function SelectedRowsCount({ value, hidden }: SelectedRowsCountProps) {
  return value !== 0 ? (
    <div className="infoBar">
      已选择 {value} 项
      {hidden !== 0 && ` (${hidden} 项被过滤隐藏)`}
    </div>
  ) : null;
}
