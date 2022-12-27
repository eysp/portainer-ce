import {
  Users,
  Award,
  Settings,
  HardDrive,
  Radio,
  FileText,
  Bell,
} from 'react-feather';

import { usePublicSettings } from '@/react/portainer/settings/queries';
import {
  FeatureFlag,
  useFeatureFlag,
} from '@/portainer/feature-flags/useRedirectFeatureFlag';

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

  const isEdgeRemoteUpgradeEnabledQuery = useFeatureFlag(
    FeatureFlag.EdgeRemoteUpdate
  );

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
              label="群组"
              data-cy="portainerSidebar-environmentGroups"
            />
            <SidebarItem
              to="portainer.tags"
              label="标记"
              data-cy="portainerSidebar-environmentTags"
            />
            {isEdgeRemoteUpgradeEnabledQuery.data && (
              <SidebarItem
                to="portainer.endpoints.updateSchedules"
                label="更新 & 回滚"
                data-cy="portainerSidebar-updateSchedules"
              />
            )}
          </SidebarItem>

          <SidebarItem
            label="注册表"
            to="portainer.registries"
            icon={Radio}
            data-cy="portainerSidebar-registries"
          />

          {process.env.PORTAINER_EDITION !== 'CE' && (
            <SidebarItem
              to="portainer.licenses"
              label="许可"
              icon={Award}
              data-cy="portainerSidebar-licenses"
            />
          )}

          <SidebarItem
            label="身份验证日志"
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
              label="身份验证"
              data-cy="portainerSidebar-authentication"
            />
          )}
          {process.env.PORTAINER_EDITION !== 'CE' && (
            <SidebarItem
              to="portainer.settings.cloud"
              label="Cloud"
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
                  ? 'https://www.portainer.io/community_help'
                  : 'https://documentation.portainer.io/r/business-support'
              }
              target="_blank"
              rel="noreferrer"
              className="px-3 rounded flex h-8 items-center"
            >
              帮助 / 关于
            </a>
          </SidebarItem.Wrapper>
          <SidebarItem.Wrapper label="汉化支持ysp">
            <a
              href={
                process.env.PORTAINER_EDITION === 'CE'
                  ? 'https://jq.qq.com/?_wv=1027&k=5HqPeR7'
                  : 'https://hub.docker.com/r/6053537/portainer-ce'
              }
              target="_blank"
              rel="noreferrer"
              className="px-3 rounded flex h-8 items-center"
            >
              汉化支持ysp
            </a>
          </SidebarItem.Wrapper>
        </SidebarItem>
      )}
    </SidebarSection>
  );
}
