import { Trash2 } from 'lucide-react';

import { DetailsTable } from '@@/DetailsTable';
import { Button } from '@@/buttons';

import { Pair } from '../../types';

export function HiddenContainersTable({
  labels,
  isLoading,
  onDelete,
}: {
  labels: Pair[];
  isLoading: boolean;
  onDelete: (name: string) => void;
}) {
  return (
    <DetailsTable
      headers={['名称', 'Value', '']}
      className="table-hover"
      emptyMessage="无可用筛选。"
      dataCy="hidden-containers-table"
    >
      {labels.map((label, index) => (
        <DetailsTable.Row
          key={index}
          label={label.name}
          columns={[
            <Button
              color="danger"
              data-cy="hidden-containers-remove-filter-button"
              size="xsmall"
              icon={Trash2}
              onClick={() => onDelete(label.name)}
              disabled={isLoading}
            >
              删除
            </Button>,
          ]}
        >
          {label.value}
        </DetailsTable.Row>
      ))}
    </DetailsTable>
  );
}
