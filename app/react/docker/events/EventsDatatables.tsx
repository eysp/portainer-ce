import { createColumnHelper } from '@tanstack/react-table';
import { Clock } from 'lucide-react';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';

type DockerEvent = {
  Time: number;
  Type: string;
  Details: string;
};

const columnHelper = createColumnHelper<DockerEvent>();

export const columns = [
  columnHelper.accessor('Time', {
      header: '日期',
      cell: ({ getValue }) => {
          const value = getValue();
          return isoDateFromTimestamp(value);
      },
  }),
  columnHelper.accessor('Type', {
      header: '类型',
  }),
  columnHelper.accessor('Details', {
      header: '详情',
  }),
];

const tableKey = 'docker-events';
const settingsStore = createPersistedStore(tableKey, {
  id: 'Time',
  desc: true,
});

export function EventsDatatable({ dataset }: { dataset: Array<DockerEvent> }) {
  const tableState = useTableState(settingsStore, tableKey);

  return (
    <Datatable
      dataset={dataset ?? []}
      columns={columns}
      settingsManager={tableState}
      title="事件"
      titleIcon={Clock}
      disableSelect
      emptyContentLabel="没有可用的事件。"
    />
  );
}
