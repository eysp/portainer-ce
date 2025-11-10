import { TextTip } from '@@/Tip/TextTip';
import { Datatable } from '@@/datatables';
import { useTableStateWithStorage } from '@@/datatables/useTableState';

import { AccessViewerPolicyModel } from './model';
import { columns } from './columns';

export function EffectiveAccessViewerDatatable({
  dataset,
}: {
  dataset?: Array<AccessViewerPolicyModel>;
}) {
  const tableState = useTableStateWithStorage('access-viewer', 'Environment');

  if (dataset?.length === 0) {
    return (
      <TextTip color="blue">
        所选用户无权访问任何环境。
      </TextTip>
    );
  }

  return (
    <Datatable
      dataset={dataset || []}
      columns={columns}
      settingsManager={tableState}
      noWidget
      title="访问"
      description={
        <TextTip color="blue">
          将为所选用户显示每个环境的有效角色。
        </TextTip>
      }
      disableSelect
      data-cy="effective-access-viewer-datatable"
    />
  );
}
