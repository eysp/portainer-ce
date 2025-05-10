import { CalendarCheck2 } from 'lucide-react';

import {
  DefaultDatatableSettings,
  TableSettings as KubeTableSettings,
} from '@/react/kubernetes/datatables/DefaultDatatableSettings';

import { Datatable, TableSettingsMenu } from '@@/datatables';
import {
  type FilteredColumnsTableSettings,
  BasicTableSettings,
} from '@@/datatables/types';
import { TableState } from '@@/datatables/useTableState';

import { columns } from '../JobsDatatable/columns';
import { Job } from '../JobsDatatable/types';

interface TableSettings
  extends KubeTableSettings,
    FilteredColumnsTableSettings {}

interface CronJobsExecutionsProps {
  item: Job[];
  tableState: TableSettings;
}

export function CronJobsExecutionsInnerDatatable({
  item,
  tableState,
}: CronJobsExecutionsProps) {
  return (
    <Datatable
      dataset={item}
      columns={columns}
      getRowId={(row) => row.Id}
      disableSelect
      title="Executions"
      titleIcon={CalendarCheck2}
      data-cy="k8s-cronJobs-executions-datatable"
      renderTableSettings={() => (
        <TableSettingsMenu>
          <DefaultDatatableSettings settings={tableState} />
        </TableSettingsMenu>
      )}
      settingsManager={tableState as unknown as TableState<BasicTableSettings>}
    />
  );
}
