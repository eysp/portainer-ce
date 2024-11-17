interface Props {
  value: number;
  onChange(value: number): void;
  showAll?: boolean;
}

export function ItemsPerPageSelector({ value, onChange, showAll }: Props) {
  return (
    <span className="limitSelector">
      <span className="space-right">每页显示项数</span>
      <select
        className="form-control"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-cy="paginationSelect"
      >
        {showAll ? <option value={Number.MAX_SAFE_INTEGER}>全部</option> : null}
        {[10, 25, 50, 100].map((v) => (
          <option value={v} key={v}>
            {v}
          </option>
        ))}
      </select>
    </span>
  );
}
