import { useCurrentStateAndParams } from '@uirouter/react';
import { Database, HardDrive } from 'lucide-react';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, findSelectedTabIndex } from '@@/Widget/WidgetTabs';

import { VolumesDatatable } from './VolumesDatatable';
import { StorageDatatable } from './StorageDatatable';

export function VolumesView() {
  const tabs: Tab[] = [
    {
      name: '卷',
      icon: Database,
      widget: <VolumesDatatable />,
      selectedTabParam: 'volumes',
    },
    {
      name: '存储',
      icon: HardDrive,
      widget: <StorageDatatable />,
      selectedTabParam: 'storage',
    },
  ];

  const currentTabIndex = findSelectedTabIndex(
    useCurrentStateAndParams(),
    tabs
  );

  return (
    <>
      <PageHeader title="卷列表" breadcrumbs="卷" reload />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
