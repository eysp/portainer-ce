import { useMemo, useState } from 'react';
import { Box, UsersRound } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { notifySuccess } from '@/portainer/services/notifications';
import { useIdParam } from '@/react/hooks/useIdParam';

import { PageHeader } from '@@/PageHeader';
import { Tab, WidgetTabs, useCurrentTabIndex } from '@@/Widget/WidgetTabs';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals/Modal';
import { buildConfirmButton } from '@@/modals/utils';

import { useGroup } from '../queries/useGroup';
import { useDeleteEnvironmentGroupMutation } from '../queries/useDeleteEnvironmentGroupMutation';

import { EnvironmentsTab } from './tabs/EnvironmentsTab';
import { AccessTab } from './tabs/AccessTab';
import { GroupHeader } from './GroupHeader';

export function EditGroupView() {
  const router = useRouter();
  const groupId = useIdParam();
  const deleteMutation = useDeleteEnvironmentGroupMutation();
  const [addEnvsDrawerOpen, setAddEnvsDrawerOpen] = useState(false);
  const groupQuery = useGroup(
    deleteMutation.isLoading || deleteMutation.isSuccess ? undefined : groupId,
    { size: true }
  );
  const group = groupQuery.data;
  const groupName = group?.Name ?? '环境分组';

  async function handleDeleteGroup() {
    const confirmed = await confirm({
      title: '删除环境分组',
      modalType: ModalType.Destructive,
      message: `确定要删除环境分组 "${groupName}" 吗？此操作无法撤销。`,
      confirmButton: buildConfirmButton('删除', 'danger'),
    });

    if (confirmed) {
      deleteMutation.mutate(groupId, {
        onSuccess() {
          notifySuccess('Success', '环境分组删除成功');
          router.stateService.go('portainer.groups');
        },
      });
    }
  }

  const tabs: Array<Tab> = useMemo(
    () => [
      {
        name: '环境',
        icon: Box,
        widget: (
          <EnvironmentsTab
            externalDrawerOpen={addEnvsDrawerOpen}
            onExternalDrawerClose={() => setAddEnvsDrawerOpen(false)}
          />
        ),
        selectedTabParam: 'environments',
      },
      {
        name: '访问',
        icon: UsersRound,
        widget: <AccessTab />,
        selectedTabParam: 'access',
      },
    ],
    [addEnvsDrawerOpen]
  );

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: '分组', link: 'portainer.groups' }, groupName]}
      />
      <div className="mx-4 space-y-4">
        <GroupHeader
          group={group}
          isLoading={groupQuery.isLoading}
          onRefresh={() => groupQuery.refetch()}
          onAddEnvironments={() => setAddEnvsDrawerOpen(true)}
          onDelete={handleDeleteGroup}
        />
        <WidgetTabs
          tabs={tabs}
          currentTabIndex={currentTabIndex}
          useContainer={false}
        />
      </div>
      {tabs[currentTabIndex].widget}
    </>
  );
}
