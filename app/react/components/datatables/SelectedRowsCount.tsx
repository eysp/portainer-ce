interface SelectedRowsCountProps {
  value: number;
}

export function SelectedRowsCount({ value }: SelectedRowsCountProps) {
  return value !== 0 ? (
    <div className="infoBar">选择了 {value} 个项目</div>
  ) : null;
}
