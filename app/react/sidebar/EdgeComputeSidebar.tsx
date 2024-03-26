import { Box, Clock, LayoutGrid, Layers } from 'lucide-react';

import { isBE } from '../portainer/feature-flags/feature-flags.service';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

export function EdgeComputeSidebar() {
  return (
    <SidebarSection title="边缘计算">
    <SidebarItem
        to="edge.groups"
        label="边缘群组"
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
        label="边缘作业"
        icon={Clock}
        data-cy="portainerSidebar-edgeJobs"
    />
    {isBE && (
        <SidebarItem
            to="edge.devices.waiting-room"
            label="等候室"
            icon={Box}
            data-cy="portainerSidebar-edgeDevicesWaitingRoom"
        />
    )}
</SidebarSection>
  );
}
