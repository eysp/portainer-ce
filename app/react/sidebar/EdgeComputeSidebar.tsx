import { Box, Clock, LayoutGrid, Layers, Puzzle, Edit } from 'lucide-react';

import { isBE } from '../portainer/feature-flags/feature-flags.service';
import { useSettings } from '../portainer/settings/queries';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { SidebarParent } from './SidebarItem/SidebarParent';

export function EdgeComputeSidebar() {
  // this sidebar is rendered only for admins, so we can safely assume that settingsQuery will succeed
  const settingsQuery = useSettings();

  if (!settingsQuery.data || !settingsQuery.data.EnableEdgeComputeFeatures) {
    return null;
  }

  const settings = settingsQuery.data;

  return (
    <SidebarSection title="边缘计算">
      <SidebarItem
        to="edge.groups"
        label="边缘分组"
        icon={LayoutGrid}
        data-cy="portainerSidebar-edgeGroups"
      />
      <SidebarItem
        to="edge.stacks"
        label="边缘堆栈"
        icon={Layers}
        data-cy="portainerSidebar-edgeStacks"
      />
      <SidebarItem
        to="edge.jobs"
        label="边缘任务"
        icon={Clock}
        data-cy="portainerSidebar-edgeJobs"
      />
      {isBE && (
        <SidebarItem
          to="edge.configurations"
          label="边缘配置"
          icon={Puzzle}
          data-cy="portainerSidebar-edgeConfigurations"
        />
      )}
      {isBE && !settings.TrustOnFirstConnect && (
        <SidebarItem
          to="edge.devices.waiting-room"
          label="Waiting Room"
          icon={Box}
          data-cy="portainerSidebar-edgeDevicesWaitingRoom"
        />
      )}
      <SidebarParent
        icon={Edit}
        label="边缘模板"
        to="edge.templates"
        data-cy="edgeSidebar-templates"
        listId="edgeSidebar-templates"
      >
        <SidebarItem
          label="应用"
          to="edge.templates"
          ignorePaths={['edge.templates.custom']}
          isSubMenu
          data-cy="edgeSidebar-appTemplates"
        />
        <SidebarItem
          label="自定义"
          to="edge.templates.custom"
          isSubMenu
          data-cy="edgeSidebar-customTemplates"
        />
      </SidebarParent>
    </SidebarSection>
  );
}
