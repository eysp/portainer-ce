import { Clock, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import _ from 'lodash';

import { notifySuccess } from '@/portainer/services/notifications';
import { withLimitToBE } from '@/react/hooks/useLimitToBE';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { confirmDelete } from '@@/modals/confirm';
import { Datatable } from '@@/datatables';
import { PageHeader } from '@@/PageHeader';
import { Button } from '@@/buttons';
import { Link } from '@@/Link';
import { useTableState } from '@@/datatables/useTableState';

import { useList } from '../queries/list';
import { EdgeUpdateSchedule, StatusType } from '../types';
import { useRemoveMutation } from '../queries/useRemoveMutation';
import { BetaAlert } from '../common/BetaAlert';

import { columns } from './columns';
import { createStore } from './datatable-store';
import { DecoratedItem } from './types';

const storageKey = 'update-schedules-list';
const settingsStore = createStore(storageKey);

export default withLimitToBE(ListView);

export function ListView() {
  const tableState = useTableState(settingsStore, storageKey);

  const listQuery = useList(true);
  const groupsQuery = useEdgeGroups({
    select: (groups) => Object.fromEntries(groups.map((g) => [g.Id, g.Name])),
  });

  const items: Array<DecoratedItem> = useMemo(() => {
    if (!listQuery.data || !groupsQuery.data) {
      return [];
    }

    return listQuery.data.map((item) => ({
      ...item,
      edgeGroupNames: _.compact(
        item.edgeGroupIds.map((id) => groupsQuery.data[id])
      ),
    }));
  }, [listQuery.data, groupsQuery.data]);

  if (!listQuery.data || !groupsQuery.data) {
    return null;
  }

  return (
    <>
      <PageHeader
        title="更新和回滚"
        reload
        breadcrumbs="更新和回滚"
      />

      <BetaAlert
        className="ml-[15px] mb-2"
        message="Beta功能 - 目前仅限于独立的Linux和Nomad边缘设备。"
      />

      <Datatable
        dataset={items}
        columns={columns}
        settingsManager={tableState}
        title="更新和回滚"
        titleIcon={Clock}
        emptyContentLabel="未找到计划"
        isLoading={listQuery.isLoading}
        renderTableActions={(selectedRows) => (
          <TableActions selectedRows={selectedRows} />
        )}
        isRowSelectable={(row) => row.original.status === StatusType.Pending}
      />
    </>
  );
}

function TableActions({
  selectedRows,
}: {
  selectedRows: EdgeUpdateSchedule[];
}) {
  const removeMutation = useRemoveMutation();
  return (
    <>
      <Button
        icon={Trash2}
        color="dangerlight"
        onClick={() => handleRemove()}
        disabled={selectedRows.length === 0}
      >
        删除
      </Button>

      <Link to=".create">
        <Button>添加更新和回滚计划</Button>
      </Link>
    </>
  );

  async function handleRemove() {
    const confirmed = await confirmDelete(
      '确定要删除这些吗?'
    );
    if (!confirmed) {
      return;
    }

    removeMutation.mutate(selectedRows, {
      onSuccess: () => {
        notifySuccess('成功', '计划成功删除');
      },
    });
  }
}
