import {
  Box,
  Clock,
  Layers,
  List,
  Lock,
  Share2,
  Shuffle,
  Trello,
  Clipboard,
  Edit,
} from 'react-feather';

import {
  type Environment,
  type EnvironmentId,
  EnvironmentStatus,
} from '@/portainer/environments/types';
import {
  Authorized,
  useUser,
  isEnvironmentAdmin,
} from '@/portainer/hooks/useUser';
import { useInfo, useVersion } from '@/docker/services/system.service';

import { SidebarItem } from './SidebarItem';
import { DashboardLink } from './items/DashboardLink';
import { VolumesLink } from './items/VolumesLink';

interface Props {
  environmentId: EnvironmentId;
  environment: Environment;
}

export function DockerSidebar({ environmentId, environment }: Props) {
  const { user } = useUser();
  const isAdmin = isEnvironmentAdmin(user, environmentId);

  const areStacksVisible =
    isAdmin || environment.SecuritySettings.allowStackManagementForRegularUsers;

  const envInfoQuery = useInfo(
    environmentId,
    (info) => !!info.Swarm?.NodeID && !!info.Swarm?.ControlAvailable
  );

  const envVersionQuery = useVersion(environmentId, (version) =>
    parseFloat(version.ApiVersion)
  );

  const isSwarmManager = envInfoQuery.data;
  const apiVersion = envVersionQuery.data || 0;

  const offlineMode = environment.Status === EnvironmentStatus.Down;

  const setupSubMenuProps = isSwarmManager
    ? {
        label: '集群',
        icon: Trello,
        to: 'docker.swarm',
        dataCy: 'portainerSidebar-swarm',
      }
    : {
        label: '主机',
        icon: Trello,
        to: 'docker.host',
        dataCy: 'portainerSidebar-host',
      };

  const featSubMenuTo = isSwarmManager
    ? 'docker.swarm.featuresConfiguration'
    : 'docker.host.featuresConfiguration';
  const registrySubMenuTo = isSwarmManager
    ? 'docker.swarm.registries'
    : 'docker.host.registries';

  return (
    <>
      <DashboardLink
        environmentId={environmentId}
        platformPath="docker"
        data-cy="dockerSidebar-dashboard"
      />

      <SidebarItem
        label="应用程序模板"
        icon={Edit}
        to="docker.templates"
        params={{ endpointId: environmentId }}
        data-cy="portainerSidebar-appTemplates"
      >
        <SidebarItem
          label="自定义模板"
          to="docker.templates.custom"
          params={{ endpointId: environmentId }}
          data-cy="dockerSidebar-customTemplates"
        />
      </SidebarItem>

      {areStacksVisible && (
        <SidebarItem
          to="docker.stacks"
          params={{ endpointId: environmentId }}
          icon={Layers}
          label="堆栈"
          data-cy="dockerSidebar-stacks"
        />
      )}

      {isSwarmManager && (
        <SidebarItem
          to="docker.services"
          params={{ endpointId: environmentId }}
          icon={Shuffle}
          label="服务"
          data-cy="dockerSidebar-services"
        />
      )}

      <SidebarItem
        to="docker.containers"
        params={{ endpointId: environmentId }}
        icon={Box}
        label="容器"
        data-cy="dockerSidebar-containers"
      />

      <SidebarItem
        to="docker.images"
        params={{ endpointId: environmentId }}
        icon={List}
        label="镜像"
        data-cy="dockerSidebar-images"
      />

      <SidebarItem
        to="docker.networks"
        params={{ endpointId: environmentId }}
        icon={Share2}
        label="网络"
        data-cy="dockerSidebar-networks"
      />

      <VolumesLink
        environmentId={environmentId}
        platformPath="docker"
        data-cy="dockerSidebar-volumes"
      />

      {apiVersion >= 1.3 && isSwarmManager && (
        <SidebarItem
          to="docker.configs"
          params={{ endpointId: environmentId }}
          icon={Clipboard}
          label="配置"
          data-cy="dockerSidebar-configs"
        />
      )}

      {apiVersion >= 1.25 && isSwarmManager && (
        <SidebarItem
          to="docker.secrets"
          params={{ endpointId: environmentId }}
          icon={Lock}
          label="机密"
          data-cy="dockerSidebar-secrets"
        />
      )}

      {!isSwarmManager && isAdmin && !offlineMode && (
        <SidebarItem
          to="docker.events"
          params={{ endpointId: environmentId }}
          icon={Clock}
          label="事件"
          data-cy="dockerSidebar-events"
        />
      )}

      <SidebarItem
        label={setupSubMenuProps.label}
        icon={setupSubMenuProps.icon}
        to={setupSubMenuProps.to}
        params={{ endpointId: environmentId }}
        data-cy={setupSubMenuProps.dataCy}
      >
        <Authorized
          authorizations="PortainerEndpointUpdateSettings"
          adminOnlyCE
          environmentId={environmentId}
        >
          <SidebarItem
            to={featSubMenuTo}
            params={{ endpointId: environmentId }}
            label="设置"
          />
        </Authorized>

        <SidebarItem
          to={registrySubMenuTo}
          params={{ endpointId: environmentId }}
          label="注册表"
        />
      </SidebarItem>
    </>
  );
}
