import angular from 'angular';

class KubernetesResourcePoolsController {
  /* @ngInject */
  constructor($async, $state, Notifications, ModalService, KubernetesResourcePoolService, KubernetesNamespaceService) {
    this.$async = $async;
    this.$state = $state;
    this.Notifications = Notifications;
    this.ModalService = ModalService;
    this.KubernetesResourcePoolService = KubernetesResourcePoolService;
    this.KubernetesNamespaceService = KubernetesNamespaceService;

    this.onInit = this.onInit.bind(this);
    this.getResourcePools = this.getResourcePools.bind(this);
    this.getResourcePoolsAsync = this.getResourcePoolsAsync.bind(this);
    this.removeAction = this.removeAction.bind(this);
    this.removeActionAsync = this.removeActionAsync.bind(this);
  }

  async removeActionAsync(selectedItems) {
    let actionCount = selectedItems.length;
    for (const pool of selectedItems) {
      try {
        const isTerminating = pool.Namespace.Status === 'Terminating';
        if (isTerminating) {
          const ns = await this.KubernetesNamespaceService.getJSONAsync(pool.Namespace.Name);
          ns.$promise.then(async (namespace) => {
            const n = JSON.parse(namespace.data);
            if (n.spec && n.spec.finalizers) {
              delete n.spec.finalizers;
            }
            await this.KubernetesNamespaceService.updateFinalizeAsync(n);
          });
        } else {
          await this.KubernetesResourcePoolService.delete(pool);
        }
        this.Notifications.success('成功删除命名空间', pool.Namespace.Name);
        const index = this.resourcePools.indexOf(pool);
        this.resourcePools.splice(index, 1);
      } catch (err) {
        this.Notifications.error('失败', err, '无法删除命名空间');
      } finally {
        --actionCount;
        if (actionCount === 0) {
          this.$state.reload(this.$state.current);
        }
      }
    }
  }

  removeAction(selectedItems) {
    const isTerminatingNS = selectedItems.some((pool) => pool.Namespace.Status === 'Terminating');
    const message = isTerminatingNS
      ? '至少有一个命名空间处于终结状态。对于终止状态的命名空间，你可以继续并强制删除，但在没有适当清理的情况下这样做可能会导致不稳定和不可预测的行为。你确定你要继续吗？'
      : '您想删除所选命名空间吗？与所选命名空间相关的所有资源也将被删除。您确定要继续吗？';
    this.ModalService.confirmWithTitle(isTerminatingNS ? '强制删除命名空间' : '你确定吗？', message, (confirmed) => {
      if (confirmed) {
        return this.$async(this.removeActionAsync, selectedItems);
      }
    });
  }

  async getResourcePoolsAsync() {
    try {
      this.resourcePools = await this.KubernetesResourcePoolService.get();
    } catch (err) {
      this.Notifications.error('失败', err, '无法检索到命名空间');
    }
  }

  getResourcePools() {
    return this.$async(this.getResourcePoolsAsync);
  }

  async onInit() {
    this.state = {
      viewReady: false,
    };

    await this.getResourcePools();

    this.state.viewReady = true;
  }

  $onInit() {
    return this.$async(this.onInit);
  }
}

export default KubernetesResourcePoolsController;
angular.module('portainer.kubernetes').controller('KubernetesResourcePoolsController', KubernetesResourcePoolsController);
