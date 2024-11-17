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
import { SidebarParent } from './SidebarItem/SidebarParent';

interface Props {
  isPureAdmin: boolean;
  isAdmin: boolean;
  isTeamLeader?: boolean;
}

export function SettingsSidebar({ isPureAdmin, isAdmin, isTeamLeader }: Props) {
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const isPureAdminOrTeamLeader =
    isPureAdmin || (isTeamLeader && !teamSyncQuery.data && !isAdmin);
  const showUsersSection = !window.ddExtension && isPureAdminOrTeamLeader;

  return (
    <SidebarSection title="管理">
      {showUsersSection && (
        <SidebarParent
          label="与用户相关"
          icon={Users}
          to="portainer.users"
          pathOptions={{ includePaths: ['portainer.teams', 'portainer.roles'] }}
          data-cy="portainerSidebar-userRelated"
          listId="portainerSidebar-userRelated"
        >
          <SidebarItem
            to="portainer.users"
            label="用户"
            isSubMenu
            data-cy="portainerSidebar-users"
          />
          <SidebarItem
            to="portainer.teams"
            label="团队"
            isSubMenu
            data-cy="portainerSidebar-teams"
          />

          {isPureAdmin && (
            <SidebarItem
              to="portainer.roles"
              label="角色"
              isSubMenu
              data-cy="portainerSidebar-roles"
            />
          )}
        </SidebarParent>
      )}
      {isPureAdmin && (
        <>
          <SidebarParent
            label="与环境相关"
            icon={HardDrive}
            to="portainer.endpoints"
            pathOptions={{
              includePaths: [
                'portainer.wizard.endpoints',
                'portainer.groups',
                'portainer.tags',
              ],
            }}
            data-cy="portainerSidebar-environments-area"
            listId="portainer-environments"
          >
            <SidebarItem
              label="环境"
              to="portainer.endpoints"
              ignorePaths={['portainer.endpoints.updateSchedules']}
              includePaths={['portainer.wizard.endpoints']}
              isSubMenu
              data-cy="portainerSidebar-environments"
            />
            <SidebarItem
              to="portainer.groups"
              label="分组"
              isSubMenu
              data-cy="portainerSidebar-environmentGroups"
            />
            <SidebarItem
              to="portainer.tags"
              label="标签"
              isSubMenu
              data-cy="portainerSidebar-environmentTags"
            />
            <EdgeUpdatesSidebarItem />
          </SidebarParent>

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

          <SidebarParent
            label="日志"
            to="portainer.authLogs"
            icon={FileText}
            pathOptions={{
              includePaths: ['portainer.activityLogs'],
            }}
            data-cy="k8sSidebar-logs"
            listId="k8sSidebar-logs"
          >
            <SidebarItem
              label="认证"
              to="portainer.authLogs"
              isSubMenu
              data-cy="portainerSidebar-authLogs"
            />
            <SidebarItem
              to="portainer.activityLogs"
              label="活动"
              isSubMenu
              data-cy="portainerSidebar-activityLogs"
            />
          </SidebarParent>
        </>
      )}
      {isBE && !isPureAdmin && isAdmin && (
        <SidebarParent
          label="与环境相关"
          icon={HardDrive}
          to="portainer.endpoints.updateSchedules"
          data-cy="portainerSidebar-environments-area"
          listId="portainer-environments-area"
        >
          <EdgeUpdatesSidebarItem />
        </SidebarParent>
      )}

      <SidebarItem
        to="portainer.notifications"
        icon={Bell}
        label="通知"
        data-cy="portainerSidebar-notifications"
      />
      {isPureAdmin && (
        <SidebarParent
          to="portainer.settings"
          label="设置"
          icon={Settings}
          data-cy="portainerSidebar-settings"
          listId="portainer-settings"
        >
          <SidebarItem
            to="portainer.settings"
            label="常规"
            isSubMenu
            ignorePaths={[
              'portainer.settings.authentication',
              'portainer.settings.sharedcredentials',
              'portainer.settings.edgeCompute',
            ]}
            data-cy="portainerSidebar-generalSettings"
          />
          {!window.ddExtension && (
            <SidebarItem
              to="portainer.settings.authentication"
              label="认证"
              isSubMenu
              data-cy="portainerSidebar-authentication"
            />
          )}
          {isBE && (
            <SidebarItem
              to="portainer.settings.sharedcredentials"
              label="共享凭据"
              isSubMenu
              data-cy="portainerSidebar-cloud"
            />
          )}

          <SidebarItem
            to="portainer.settings.edgeCompute"
            label="边缘计算"
            isSubMenu
            data-cy="portainerSidebar-edgeCompute"
          />

          <SidebarItem.Wrapper label="帮助 / 关于">
            <a
              href={
                process.env.PORTAINER_EDITION === 'CE'
                  ? 'https://www.portainer.io/community_help'
                  : 'https://documentation.portainer.io/r/business-support'
              }
              target="_blank"
              rel="noreferrer"
              className="hover:!underline focus:no-underline text-sm flex h-8 w-full items-center rounded px-3 transition-colors duration-200 hover:bg-blue-5/20 be:hover:bg-gray-5/20 th-dark:hover:bg-gray-true-5/20"
            >
              帮助 / 关于
            </a>
          </SidebarItem.Wrapper>
        </SidebarParent>
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
      isSubMenu
      data-cy="portainerSidebar-updateSchedules"
    />
  );
}
