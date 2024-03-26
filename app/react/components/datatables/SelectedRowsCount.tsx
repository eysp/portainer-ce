interface SelectedRowsCountProps {
  value: number;
}

export function SelectedRowsCount({ value }: SelectedRowsCountProps) {
  return value !== 0 ? (
    <div className="infoBar">{value} 项已选择</div>
  ) : null;
}
