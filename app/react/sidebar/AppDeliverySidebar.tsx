import { Database, GitBranch } from 'lucide-react';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

export function AppDeliverySidebar() {
  return (
    <SidebarSection title="应用交付">
      <SidebarItem
        label="工作流"
        to="portainer.gitops.workflows"
        icon={GitBranch}
        data-cy="portainerSidebar-workflows"
      />

      <SidebarItem
        label="资源仓库"
        to="portainer.gitops.sources"
        icon={Database}
        data-cy="portainerSidebar-sources"
      />
    </SidebarSection>
  );
}
