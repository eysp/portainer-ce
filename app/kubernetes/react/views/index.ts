import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { IngressesDatatableView } from '@/react/kubernetes/ingresses/IngressDatatable';
import { CreateIngressView } from '@/react/kubernetes/ingresses/CreateIngressView';
import { DashboardView } from '@/react/kubernetes/dashboard/DashboardView';
import { ServicesView } from '@/react/kubernetes/services/ServicesView';
import { ConsoleView } from '@/react/kubernetes/applications/ConsoleView';
import { ConfigmapsAndSecretsView } from '@/react/kubernetes/configs/ListView/ConfigmapsAndSecretsView';
import { CreateNamespaceView } from '@/react/kubernetes/namespaces/CreateView/CreateNamespaceView';
import { ApplicationsView } from '@/react/kubernetes/applications/ListView/ApplicationsView';
import { ApplicationDetailsView } from '@/react/kubernetes/applications/DetailsView/ApplicationDetailsView';
import { ConfigureView } from '@/react/kubernetes/cluster/ConfigureView';
import { NamespacesView } from '@/react/kubernetes/namespaces/ListView/NamespacesView';
import { ServiceAccountsView } from '@/react/kubernetes/more-resources/ServiceAccountsView/ServiceAccountsView';
import { ClusterRolesView } from '@/react/kubernetes/more-resources/ClusterRolesView';
import { RolesView } from '@/react/kubernetes/more-resources/RolesView';
import { VolumesView } from '@/react/kubernetes/volumes/ListView/VolumesView';
import { NamespaceView } from '@/react/kubernetes/namespaces/ItemView/NamespaceView';
import { AccessView } from '@/react/kubernetes/namespaces/AccessView/AccessView';
import { JobsView } from '@/react/kubernetes/more-resources/JobsView/JobsView';

export const viewsModule = angular
  .module('portainer.kubernetes.react.views', [])
  .component(
    'kubernetesCreateNamespaceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(CreateNamespaceView))), [])
  )
  .component(
    'namespaceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NamespaceView))), [])
  )
  .component(
    'kubernetesNamespacesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NamespacesView))), [])
  )
  .component(
    'kubernetesNamespaceAccessView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(AccessView))), [])
  )
  .component(
    'kubernetesServicesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ServicesView))), [])
  )
  .component(
    'kubernetesVolumesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(VolumesView))), [])
  )
  .component(
    'kubernetesIngressesView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(IngressesDatatableView))),
      []
    )
  )
  .component(
    'kubernetesIngressesCreateView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(CreateIngressView))), [])
  )
  .component(
    'kubernetesConfigMapsAndSecretsView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ConfigmapsAndSecretsView))),
      []
    )
  )
  .component(
    'kubernetesApplicationsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ApplicationsView))), [])
  )
  .component(
    'applicationDetailsView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ApplicationDetailsView))),
      []
    )
  )
  .component(
    'kubernetesConfigureView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ConfigureView))), [])
  )
  .component(
    'kubernetesDashboardView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(DashboardView))), [])
  )
  .component(
    'kubernetesConsoleView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ConsoleView))), [])
  )
  .component(
    'jobsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(JobsView))), [])
  )
  .component(
    'serviceAccountsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ServiceAccountsView))), [])
  )
  .component(
    'clusterRolesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ClusterRolesView))), [])
  )
  .component(
    'k8sRolesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(RolesView))), [])
  ).name;
