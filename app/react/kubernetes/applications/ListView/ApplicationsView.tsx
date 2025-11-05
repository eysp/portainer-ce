import { BoxIcon, List } from 'lucide-react';
import { useCurrentStateAndParams } from '@uirouter/react';

import { usePublicSettings } from '@/react/portainer/settings/queries/usePublicSettings';

import { PageHeader } from '@@/PageHeader';
import { Tab, WidgetTabs, findSelectedTabIndex } from '@@/Widget/WidgetTabs';

import { ApplicationsDatatable } from './ApplicationsDatatable';
import { ApplicationsStacksDatatable } from './ApplicationsStacksDatatable';
import { useKubeAppsTableStore } from './useKubeAppsTableStore';

export function ApplicationsView() {
  const tableState = useKubeAppsTableStore('kubernetes.applications', 'Name');
  const hideStacksQuery = usePublicSettings({
    select: (settings) =>
      settings.GlobalDeploymentOptions.hideStacksFunctionality,
  });
  const hideStacks = hideStacksQuery.isLoading || !!hideStacksQuery.data;

  const tabs: Tab[] = [
    {
      name: '应用',
      icon: BoxIcon,
      widget: <ApplicationsDatatable tableState={tableState} />,
      selectedTabParam: 'applications',
    },
    {
      name: '堆栈',
      icon: List,
      widget: <ApplicationsStacksDatatable tableState={tableState} />,
      selectedTabParam: 'stacks',
    },
  ];

  const currentTabIndex = findSelectedTabIndex(
    useCurrentStateAndParams(),
    tabs
  );

  return (
    <>
      <PageHeader title="应用列表" breadcrumbs="应用" reload />
      {hideStacks ? (
        <ApplicationsDatatable tableState={tableState} hideStacks />
      ) : (
        <>
          <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
          <div className="content">{tabs[currentTabIndex].widget}</div>
        </>
      )}
    </>
  );
}
