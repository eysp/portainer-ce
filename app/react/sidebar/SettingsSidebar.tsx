import {
  Users,
  Award,
  Settings,
  HardDrive,
  Radio,
  FileText,
  Bell,
} from 'lucide-react';

import { usePublicSettings } from '@/react/portainer/settings/queries';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

interface Props {
  isAdmin: boolean;
  isTeamLeader?: boolean;
}

export function SettingsSidebar({ isAdmin, isTeamLeader }: Props) {
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const showUsersSection =
    !window.ddExtension && (isAdmin || (isTeamLeader && !teamSyncQuery.data));

  return (
    <SidebarSection title="设置">
  {showUsersSection && (
    <SidebarItem
      to="portainer.users"
      label="用户"
      icon={Users}
      data-cy="portainerSidebar-users"
    >
      <SidebarItem
        to="portainer.teams"
        label="团队"
        data-cy="portainerSidebar-teams"
      />

      {isAdmin && (
        <SidebarItem
          to="portainer.roles"
          label="角色"
          data-cy="portainerSidebar-roles"
        />
      )}
    </SidebarItem>
  )}
  {isAdmin && (
    <>
      <SidebarItem
        label="环境"
        to="portainer.endpoints"
        icon={HardDrive}
        openOnPaths={['portainer.wizard.endpoints']}
        data-cy="portainerSidebar-environments"
      >
        <SidebarItem
          to="portainer.groups"
          label="分组"
          data-cy="portainerSidebar-environmentGroups"
        />
        <SidebarItem
          to="portainer.tags"
          label="标签"
          data-cy="portainerSidebar-environmentTags"
        />
        <EdgeUpdatesSidebarItem />
      </SidebarItem>

      <SidebarItem
        label="注册表"
        to="portainer.registries"
        icon={Radio}
        data-cy="portainerSidebar-registries"
      />

      {isBE && (
        <SidebarItem
          to="portainer.licenses"
          label="许可证"
          icon={Award}
          data-cy="portainerSidebar-licenses"
        />
      )}

      <SidebarItem
        label="认证日志"
        to="portainer.authLogs"
        icon={FileText}
        data-cy="portainerSidebar-authLogs"
      >
        <SidebarItem
          to="portainer.activityLogs"
          label="活动日志"
          data-cy="portainerSidebar-activityLogs"
        />
      </SidebarItem>
    </>
  )}
  <SidebarItem
    to="portainer.notifications"
    icon={Bell}
    label="通知"
    data-cy="portainerSidebar-notifications"
  />
  {isAdmin && (
    <SidebarItem
      to="portainer.settings"
      label="设置"
      icon={Settings}
      data-cy="portainerSidebar-settings"
    >
      {!window.ddExtension && (
        <SidebarItem
          to="portainer.settings.authentication"
          label="认证"
          data-cy="portainerSidebar-authentication"
        />
      )}
      {isBE && (
        <SidebarItem
          to="portainer.settings.cloud"
          label="云"
          data-cy="portainerSidebar-cloud"
        />
      )}
      <SidebarItem
        to="portainer.settings.edgeCompute"
        label="边缘计算"
        data-cy="portainerSidebar-edgeCompute"
      />

      <SidebarItem.Wrapper label="帮助 / 关于">
        <a
          href={
            process.env.PORTAINER_EDITION === 'CE'
              ? 'https://hub.docker.com/r/6053537/portainer-ce'
              : 'https://documentation.portainer.io/r/business-support'
          }
          target="_blank"
          rel="noreferrer"
          className="flex h-8 items-center rounded px-3"
        >
          帮助 / 关于
        </a>
      </SidebarItem.Wrapper>
    </SidebarItem>
  )}
</SidebarSection>
  );
}

function EdgeUpdatesSidebarItem() {
  const settingsQuery = usePublicSettings();

  if (!isBE || !settingsQuery.data?.EnableEdgeComputeFeatures) {
    return null;
  }

  return (
    <SidebarItem
      to="portainer.endpoints.updateSchedules"
      label="更新与回滚"
      data-cy="portainerSidebar-updateSchedules"
    />
  );
}
