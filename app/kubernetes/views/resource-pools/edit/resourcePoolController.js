import angular from 'angular';
import _ from 'lodash-es';
import filesizeParser from 'filesize-parser';
import { KubernetesResourceQuotaDefaults } from 'Kubernetes/models/resource-quota/models';
import KubernetesResourceReservationHelper from 'Kubernetes/helpers/resourceReservationHelper';
import { KubernetesResourceReservation } from 'Kubernetes/models/resource-reservation/models';
import KubernetesEventHelper from 'Kubernetes/helpers/eventHelper';
import {
  KubernetesResourcePoolFormValues,
  KubernetesResourcePoolIngressClassAnnotationFormValue,
  KubernetesResourcePoolIngressClassHostFormValue,
} from 'Kubernetes/models/resource-pool/formValues';
import { KubernetesIngressConverter } from 'Kubernetes/ingress/converter';
import { KubernetesFormValidationReferences } from 'Kubernetes/models/application/formValues';
import KubernetesFormValidationHelper from 'Kubernetes/helpers/formValidationHelper';
import { KubernetesIngressClassTypes } from 'Kubernetes/ingress/constants';
import KubernetesResourceQuotaConverter from 'Kubernetes/converters/resourceQuota';
import KubernetesNamespaceHelper from 'Kubernetes/helpers/namespaceHelper';
import { K8S_RESOURCE_POOL_LB_QUOTA, K8S_RESOURCE_POOL_STORAGE_QUOTA } from '@/portainer/feature-flags/feature-ids';

class KubernetesResourcePoolController {
  /* #region  CONSTRUCTOR */
  /* @ngInject */
  constructor(
    $async,
    $state,
    Authentication,
    Notifications,
    LocalStorage,
    EndpointService,
    ModalService,
    KubernetesNodeService,
    KubernetesMetricsService,
    KubernetesResourceQuotaService,
    KubernetesResourcePoolService,
    KubernetesEventService,
    KubernetesPodService,
    KubernetesApplicationService,
    KubernetesIngressService,
    KubernetesVolumeService
  ) {
    Object.assign(this, {
      $async,
      $state,
      Authentication,
      Notifications,
      LocalStorage,
      EndpointService,
      ModalService,
      KubernetesNodeService,
      KubernetesMetricsService,
      KubernetesResourceQuotaService,
      KubernetesResourcePoolService,
      KubernetesEventService,
      KubernetesPodService,
      KubernetesApplicationService,
      KubernetesIngressService,
      KubernetesVolumeService,
    });

    this.IngressClassTypes = KubernetesIngressClassTypes;
    this.ResourceQuotaDefaults = KubernetesResourceQuotaDefaults;

    this.LBQuotaFeatureId = K8S_RESOURCE_POOL_LB_QUOTA;
    this.StorageQuotaFeatureId = K8S_RESOURCE_POOL_STORAGE_QUOTA;

    this.updateResourcePoolAsync = this.updateResourcePoolAsync.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }
  /* #endregion */

  /* #region  ANNOTATIONS MANAGEMENT */
  addAnnotation(ingressClass) {
    ingressClass.Annotations.push(new KubernetesResourcePoolIngressClassAnnotationFormValue());
  }

  removeAnnotation(ingressClass, index) {
    ingressClass.Annotations.splice(index, 1);
    this.onChangeIngressHostname();
  }
  /* #endregion */

  /* #region  INGRESS MANAGEMENT */
  onChangeIngressHostname() {
    const state = this.state.duplicates.ingressHosts;
    const otherIngresses = _.without(this.allIngresses, ...this.ingresses);
    const allHosts = _.flatMap(otherIngresses, 'Hosts');

    const hosts = _.flatMap(this.formValues.IngressClasses, 'Hosts');
    const hostsWithoutRemoved = _.filter(hosts, { NeedsDeletion: false });
    const hostnames = _.map(hostsWithoutRemoved, 'Host');
    const formDuplicates = KubernetesFormValidationHelper.getDuplicates(hostnames);
    _.forEach(hostnames, (host, idx) => {
      if (host !== undefined && _.includes(allHosts, host)) {
        formDuplicates[idx] = host;
      }
    });
    const duplicatedHostnames = Object.values(formDuplicates);
    state.hasRefs = false;
    _.forEach(this.formValues.IngressClasses, (ic) => {
      _.forEach(ic.Hosts, (hostFV) => {
        if (_.includes(duplicatedHostnames, hostFV.Host) && hostFV.NeedsDeletion === false) {
          hostFV.Duplicate = true;
          state.hasRefs = true;
        } else {
          hostFV.Duplicate = false;
        }
      });
    });
  }

  addHostname(ingressClass) {
    ingressClass.Hosts.push(new KubernetesResourcePoolIngressClassHostFormValue());
  }

  removeHostname(ingressClass, index) {
    if (!ingressClass.Hosts[index].IsNew) {
      ingressClass.Hosts[index].NeedsDeletion = true;
    } else {
      ingressClass.Hosts.splice(index, 1);
    }
    this.onChangeIngressHostname();
  }

  restoreHostname(host) {
    if (!host.IsNew) {
      host.NeedsDeletion = false;
    }
  }
  /* #endregion*/

  selectTab(index) {
    this.LocalStorage.storeActiveTab('resourcePool', index);
  }

  isUpdateButtonDisabled() {
    return this.state.actionInProgress || (this.formValues.HasQuota && !this.isQuotaValid()) || this.state.duplicates.ingressHosts.hasRefs;
  }

  isQuotaValid() {
    if (
      this.state.sliderMaxCpu < this.formValues.CpuLimit ||
      this.state.sliderMaxMemory < this.formValues.MemoryLimit ||
      (this.formValues.CpuLimit === 0 && this.formValues.MemoryLimit === 0)
    ) {
      return false;
    }
    return true;
  }

  checkDefaults() {
    if (this.formValues.CpuLimit < KubernetesResourceQuotaDefaults.CpuLimit) {
      this.formValues.CpuLimit = KubernetesResourceQuotaDefaults.CpuLimit;
    }
    if (this.formValues.MemoryLimit < KubernetesResourceReservationHelper.megaBytesValue(KubernetesResourceQuotaDefaults.MemoryLimit)) {
      this.formValues.MemoryLimit = KubernetesResourceReservationHelper.megaBytesValue(KubernetesResourceQuotaDefaults.MemoryLimit);
    }
  }

  showEditor() {
    this.state.showEditorTab = true;
    this.selectTab(2);
  }

  hasResourceQuotaBeenReduced() {
    if (this.formValues.HasQuota && this.oldQuota) {
      const cpuLimit = this.formValues.CpuLimit;
      const memoryLimit = KubernetesResourceReservationHelper.bytesValue(this.formValues.MemoryLimit);
      if (cpuLimit < this.oldQuota.CpuLimit || memoryLimit < this.oldQuota.MemoryLimit) {
        return true;
      }
    }
    return false;
  }

  /* #region  UPDATE NAMESPACE */
  async updateResourcePoolAsync(oldFormValues, newFormValues) {
    this.state.actionInProgress = true;
    try {
      this.checkDefaults();
      await this.KubernetesResourcePoolService.patch(oldFormValues, newFormValues);
      this.Notifications.success('Namespace 成功更新', this.pool.Namespace.Name);
      this.$state.reload(this.$state.current);
    } catch (err) {
      this.Notifications.error('失败', err, '无法创建 namespace');
    } finally {
      this.state.actionInProgress = false;
    }
  }

  updateResourcePool() {
    const ingressesToDelete = _.filter(this.formValues.IngressClasses, { WasSelected: true, Selected: false });
    const registriesToDelete = _.filter(this.registries, { WasChecked: true, Checked: false });
    const warnings = {
      quota: this.hasResourceQuotaBeenReduced(),
      ingress: ingressesToDelete.length !== 0,
      registries: registriesToDelete.length !== 0,
    };

    if (warnings.quota || warnings.ingress || warnings.registries) {
      const messages = {
        quota:
          '减少分配给“使用中”namespace的配额可能会产生意想不到的后果，包括阻止正在运行的应用程序正常运行，甚至可能完全阻止它们运行。',
        ingress: '停用入口可能会导致应用程序无法访问。 来自受影响应用程序的所有入口配置都将被删除。',
        registries:
          '您删除的某些注册表可能会被此环境中的一个或多个应用程序使用。 删除注册表访问可能会导致这些应用程序的服务中断。',
      };
      const displayedMessage = `${warnings.quota ? messages.quota + '<br/><br/>' : ''}
      ${warnings.ingress ? messages.ingress + '<br/><br/>' : ''}
      ${warnings.registries ? messages.registries + '<br/><br/>' : ''}
      你想继续吗？`;
      this.ModalService.confirmUpdate(displayedMessage, (confirmed) => {
        if (confirmed) {
          return this.$async(this.updateResourcePoolAsync, this.savedFormValues, this.formValues);
        }
      });
    } else {
      return this.$async(this.updateResourcePoolAsync, this.savedFormValues, this.formValues);
    }
  }

  async confirmMarkUnmarkAsSystem() {
    const message = this.isSystem
      ? '取消将此命名空间标记为系统将允许非管理员用户根据访问控制设置管理它和包含的资源。 你确定吗？'
      : '将此命名空间标记为系统命名空间将阻止非管理员用户管理它及其包含的资源。 你确定吗？';

    return new Promise((resolve) => {
      this.ModalService.confirmUpdate(message, resolve);
    });
  }

  markUnmarkAsSystem() {
    return this.$async(async () => {
      try {
        const namespaceName = this.$state.params.id;
        this.state.actionInProgress = true;

        const confirmed = await this.confirmMarkUnmarkAsSystem();
        if (!confirmed) {
          return;
        }
        await this.KubernetesResourcePoolService.toggleSystem(this.endpoint.Id, namespaceName, !this.isSystem);

        this.Notifications.success('Namespace 成功更新', namespaceName);
        this.$state.reload(this.$state.current);
      } catch (err) {
        this.Notifications.error('失败', err, '无法创建 namespace');
      } finally {
        this.state.actionInProgress = false;
      }
    });
  }
  /* #endregion */

  hasEventWarnings() {
    return this.state.eventWarningCount;
  }

  /* #region  GET EVENTS */
  getEvents() {
    return this.$async(async () => {
      try {
        this.state.eventsLoading = true;
        this.events = await this.KubernetesEventService.get(this.pool.Namespace.Name);
        this.state.eventWarningCount = KubernetesEventHelper.warningCount(this.events);
      } catch (err) {
        this.Notifications.error('失败', err, '无法检索namespace相关事件');
      } finally {
        this.state.eventsLoading = false;
      }
    });
  }
  /* #endregion */

  /* #region  GET APPLICATIONS */
  getApplications() {
    return this.$async(async () => {
      try {
        this.state.applicationsLoading = true;
        this.applications = await this.KubernetesApplicationService.get(this.pool.Namespace.Name);
        this.applications = _.map(this.applications, (app) => {
          const resourceReservation = KubernetesResourceReservationHelper.computeResourceReservation(app.Pods);
          app.CPU = resourceReservation.CPU;
          app.Memory = resourceReservation.Memory;
          return app;
        });

        if (this.state.useServerMetrics) {
          await this.getResourceUsage(this.pool.Namespace.Name);
        }
      } catch (err) {
        this.Notifications.error('失败', err, '无法检索应用程序。');
      } finally {
        this.state.applicationsLoading = false;
      }
    });
  }
  /* #endregion */

  /* #region  GET INGRESSES */
  getIngresses() {
    return this.$async(async () => {
      this.state.ingressesLoading = true;
      try {
        const namespace = this.pool.Namespace.Name;
        this.allIngresses = await this.KubernetesIngressService.get(this.state.hasWriteAuthorization ? '' : namespace);
        this.ingresses = _.filter(this.allIngresses, { Namespace: namespace });
        _.forEach(this.ingresses, (ing) => {
          ing.Namespace = namespace;
          _.forEach(ing.Paths, (path) => {
            const application = _.find(this.applications, { ServiceName: path.ServiceName });
            path.ApplicationName = application && application.Name ? application.Name : '-';
          });
        });
      } catch (err) {
        this.Notifications.error('失败', err, '无法检索入口。');
      } finally {
        this.state.ingressesLoading = false;
      }
    });
  }
  /* #endregion */

  /* #region  GET REGISTRIES */
  getRegistries() {
    return this.$async(async () => {
      try {
        const namespace = this.$state.params.id;

        if (this.isAdmin) {
          this.registries = await this.EndpointService.registries(this.endpoint.Id);
          this.registries.forEach((reg) => {
            if (reg.RegistryAccesses && reg.RegistryAccesses[this.endpoint.Id] && reg.RegistryAccesses[this.endpoint.Id].Namespaces.includes(namespace)) {
              reg.Checked = true;
              reg.WasChecked = true;
              this.formValues.Registries.push(reg);
            }
          });
          this.selectedRegistries = this.formValues.Registries.map((r) => r.Name).join(', ');
          return;
        }

        const registries = await this.EndpointService.registries(this.endpoint.Id, namespace);
        this.selectedRegistries = registries.map((r) => r.Name).join(', ');
      } catch (err) {
        this.Notifications.error('失败', err, '无法检索注册表');
      }
    });
  }
  /* #endregion */

  async getResourceUsage(namespace) {
    try {
      const namespaceMetrics = await this.KubernetesMetricsService.getPods(namespace);
      // extract resource usage of all containers within each pod of the namespace
      const containerResourceUsageList = namespaceMetrics.items.flatMap((i) => i.containers.map((c) => c.usage));
      const namespaceResourceUsage = containerResourceUsageList.reduce((total, u) => {
        total.CPU += KubernetesResourceReservationHelper.parseCPU(u.cpu);
        total.Memory += KubernetesResourceReservationHelper.megaBytesValue(u.memory);
        return total;
      }, new KubernetesResourceReservation());
      this.state.resourceUsage = namespaceResourceUsage;
    } catch (err) {
      this.Notifications.error('失败', '无法检索 amespace 资源使用情况', err);
    }
  }

  /* #region  ON INIT */
  $onInit() {
    return this.$async(async () => {
      try {
        this.isAdmin = this.Authentication.isAdmin();

        this.state = {
          actionInProgress: false,
          sliderMaxMemory: 0,
          sliderMaxCpu: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          resourceReservation: { CPU: 0, Memory: 0 },
          activeTab: 0,
          currentName: this.$state.$current.name,
          showEditorTab: false,
          eventsLoading: true,
          applicationsLoading: true,
          ingressesLoading: true,
          viewReady: false,
          eventWarningCount: 0,
          canUseIngress: this.endpoint.Kubernetes.Configuration.IngressClasses.length,
          useServerMetrics: this.endpoint.Kubernetes.Configuration.UseServerMetrics,
          duplicates: {
            ingressHosts: new KubernetesFormValidationReferences(),
          },
        };

        this.state.activeTab = this.LocalStorage.getActiveTab('resourcePool');

        const name = this.$state.params.id;

        const [nodes, pools] = await Promise.all([this.KubernetesNodeService.get(), this.KubernetesResourcePoolService.get()]);

        this.pool = _.find(pools, { Namespace: { Name: name } });
        this.formValues = new KubernetesResourcePoolFormValues(KubernetesResourceQuotaDefaults);
        this.formValues.Name = this.pool.Namespace.Name;
        this.formValues.EndpointId = this.endpoint.Id;
        this.formValues.IsSystem = this.pool.Namespace.IsSystem;

        _.forEach(nodes, (item) => {
          this.state.sliderMaxMemory += filesizeParser(item.Memory);
          this.state.sliderMaxCpu += item.CPU;
        });
        this.state.sliderMaxMemory = KubernetesResourceReservationHelper.megaBytesValue(this.state.sliderMaxMemory);

        const quota = this.pool.Quota;
        if (quota) {
          this.oldQuota = angular.copy(quota);
          this.formValues = KubernetesResourceQuotaConverter.quotaToResourcePoolFormValues(quota);
          this.formValues.EndpointId = this.endpoint.Id;

          this.state.resourceReservation.CPU = quota.CpuLimitUsed;
          this.state.resourceReservation.Memory = KubernetesResourceReservationHelper.megaBytesValue(quota.MemoryLimitUsed);
        }
        this.isSystem = KubernetesNamespaceHelper.isSystemNamespace(this.pool.Namespace.Name);
        this.isDefaultNamespace = KubernetesNamespaceHelper.isDefaultNamespace(this.pool.Namespace.Name);
        this.isEditable = !this.isSystem && !this.isDefaultNamespace;

        await this.getEvents();
        await this.getApplications();

        if (this.state.canUseIngress) {
          await this.getIngresses();
          const ingressClasses = this.endpoint.Kubernetes.Configuration.IngressClasses;
          this.formValues.IngressClasses = KubernetesIngressConverter.ingressClassesToFormValues(ingressClasses, this.ingresses);
          _.forEach(this.formValues.IngressClasses, (ic) => {
            if (ic.Hosts.length === 0) {
              ic.Hosts.push(new KubernetesResourcePoolIngressClassHostFormValue());
            }
          });
        }

        await this.getRegistries();

        this.savedFormValues = angular.copy(this.formValues);
      } catch (err) {
        this.Notifications.error('失败', err, '无法加载视图数据');
      } finally {
        this.state.viewReady = true;
      }
    });
  }

  /* #endregion */

  $onDestroy() {
    if (this.state.currentName !== this.$state.$current.name) {
      this.LocalStorage.storeActiveTab('resourcePool', 0);
    }
  }
}

export default KubernetesResourcePoolController;
angular.module('portainer.kubernetes').controller('KubernetesResourcePoolController', KubernetesResourcePoolController);
