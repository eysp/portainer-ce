import angular from 'angular';

class KubernetesResourcePoolsController {
  /* @ngInject */
  constructor($async, $state, Notifications, ModalService, KubernetesResourcePoolService) {
    this.$async = $async;
    this.$state = $state;
    this.Notifications = Notifications;
    this.ModalService = ModalService;
    this.KubernetesResourcePoolService = KubernetesResourcePoolService;

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
        await this.KubernetesResourcePoolService.delete(pool);
        this.Notifications.success('Namespace 成功删除', pool.Namespace.Name);
        const index = this.resourcePools.indexOf(pool);
        this.resourcePools.splice(index, 1);
      } catch (err) {
        this.Notifications.error('失败', err, '无法移除namespace');
      } finally {
        --actionCount;
        if (actionCount === 0) {
          this.$state.reload(this.$state.current);
        }
      }
    }
  }

  removeAction(selectedItems) {
    this.ModalService.confirmDeletion(
      '您要删除选定的命名空间吗？ 与所选命名空间关联的所有资源也将被删除。',
      (confirmed) => {
        if (confirmed) {
          return this.$async(this.removeActionAsync, selectedItems);
        }
      }
    );
  }

  async getResourcePoolsAsync() {
    try {
      this.resourcePools = await this.KubernetesResourcePoolService.get();
    } catch (err) {
      this.Notifications.error('失败', err, '无法检索namespaces');
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
