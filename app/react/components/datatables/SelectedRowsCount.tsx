import { addPlural } from '@/react/common/string-utils';

interface SelectedRowsCountProps {
  value: number;
  hidden: number;
}

export function SelectedRowsCount({ value, hidden }: SelectedRowsCountProps) {
  return value !== 0 ? (
    <div className="infoBar">
      {addPlural(value, '项')} 已选择
      {hidden !== 0 && ` (${hidden} 项被筛选隐藏)`}
    </div>
  ) : null;
}
