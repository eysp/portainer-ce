import { Box, Edit, Layers, Lock, Network, Server } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { Authorized } from '@/react/hooks/useUser';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { DashboardLink } from '../items/DashboardLink';
import { SidebarItem } from '../SidebarItem';
import { VolumesLink } from '../items/VolumesLink';
import { SidebarParent } from '../SidebarItem/SidebarParent';

import { KubectlShellButton } from './KubectlShell';

interface Props {
  environmentId: EnvironmentId;
}

export function KubernetesSidebar({ environmentId }: Props) {
  return (
    <>
      <div className="w-full flex mb-2 justify-center -mt-2">
        <KubectlShellButton environmentId={environmentId} />
      </div>

      <DashboardLink
        environmentId={environmentId}
        platformPath="kubernetes"
        data-cy="k8sSidebar-dashboard"
      />

      <SidebarItem
        to="kubernetes.templates.custom"
        params={{ endpointId: environmentId }}
        icon={Edit}
        label="自定义模板"
        data-cy="k8sSidebar-customTemplates"
      />

      <SidebarItem
        to="kubernetes.resourcePools"
        params={{ endpointId: environmentId }}
        icon={Layers}
        label="命名空间"
        data-cy="k8sSidebar-namespaces"
      />

      <SidebarItem
        to="kubernetes.applications"
        params={{ endpointId: environmentId }}
        icon={Box}
        label="应用"
        data-cy="k8sSidebar-applications"
      />

      <SidebarParent
        label="网络"
        icon={Network}
        to="kubernetes.services"
        params={{ endpointId: environmentId }}
        pathOptions={{ includePaths: ['kubernetes.ingresses'] }}
        data-cy="k8sSidebar-networking"
        listId="k8sSidebar-networking"
      >
        <SidebarItem
          to="kubernetes.services"
          params={{ endpointId: environmentId }}
          label="服务"
          isSubMenu
          data-cy="k8sSidebar-services"
        />

        <SidebarItem
          to="kubernetes.ingresses"
          params={{ endpointId: environmentId }}
          label="入口"
          isSubMenu
          data-cy="k8sSidebar-ingresses"
        />
      </SidebarParent>

      <SidebarItem
        to="kubernetes.configurations"
        params={{ endpointId: environmentId }}
        icon={Lock}
        label="配置映射 & 密钥"
        data-cy="k8sSidebar-configurations"
      />

      <VolumesLink
        environmentId={environmentId}
        platformPath="kubernetes"
        data-cy="k8sSidebar-volumes"
      />

      <SidebarParent
        label="集群"
        icon={Server}
        to="kubernetes.cluster"
        params={{ endpointId: environmentId }}
        pathOptions={{ includePaths: ['kubernetes.registries'] }}
        data-cy="k8sSidebar-cluster-area"
        listId="k8sSidebar-cluster-area"
      >
        <SidebarItem
          label="详情"
          to="kubernetes.cluster"
          ignorePaths={[
            'kubernetes.cluster.setup',
            'kubernetes.cluster.securityConstraint',
          ]}
          params={{ endpointId: environmentId }}
          isSubMenu
          data-cy="k8sSidebar-cluster"
        />
        <Authorized
          authorizations="K8sClusterSetupRW"
          adminOnlyCE
          environmentId={environmentId}
        >
          <SidebarItem
            to="kubernetes.cluster.setup"
            params={{ endpointId: environmentId }}
            label="设置"
            isSubMenu
            data-cy="k8sSidebar-setup"
          />
        </Authorized>

        <Authorized
          authorizations="K8sClusterSetupRW"
          adminOnlyCE
          environmentId={environmentId}
        >
          <SidebarItem
            to="kubernetes.cluster.securityConstraint"
            params={{ endpointId: environmentId }}
            label="安全约束"
            isSubMenu
            data-cy="k8sSidebar-securityConstraints"
          />
        </Authorized>

        {isBE && (
          <Authorized
            authorizations="K8sClusterSetupRW"
            adminOnlyCE
            environmentId={environmentId}
          >
            <SidebarItem
              to="kubernetes.cluster.securityConstraint"
              params={{ endpointId: environmentId }}
              label="安全约束"
              isSubMenu
              data-cy="k8sSidebar-securityConstraints"
            />
          </Authorized>
        )}

        <SidebarItem
          to="kubernetes.registries"
          params={{ endpointId: environmentId }}
          label="注册表"
          isSubMenu
          data-cy="k8sSidebar-registries"
        />
      </SidebarParent>
    </>
  );
}
