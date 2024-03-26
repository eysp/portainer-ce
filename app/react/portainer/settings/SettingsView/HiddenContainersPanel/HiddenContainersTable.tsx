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
      emptyMessage="没有可用的过滤。"
    >
      {labels.map((label, index) => (
        <DetailsTable.Row
          key={index}
          label={label.name}
          columns={[
            <Button
              color="danger"
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
