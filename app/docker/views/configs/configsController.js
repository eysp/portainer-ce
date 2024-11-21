import angular from 'angular';
import { confirmDelete } from '@@/modals/confirm';

class ConfigsController {
  /* @ngInject */
  constructor($state, ConfigService, Notifications, $async, endpoint) {
    this.$state = $state;
    this.ConfigService = ConfigService;
    this.Notifications = Notifications;
    this.$async = $async;
    this.endpoint = endpoint;

    this.removeAction = this.removeAction.bind(this);
    this.removeActionAsync = this.removeActionAsync.bind(this);
    this.getConfigs = this.getConfigs.bind(this);
    this.getConfigsAsync = this.getConfigsAsync.bind(this);
  }

  getConfigs() {
    return this.$async(this.getConfigsAsync);
  }

  async getConfigsAsync() {
    try {
      this.configs = await this.ConfigService.configs(this.endpoint.Id);
    } catch (err) {
      this.Notifications.error('失败', err, '无法获取配置');
    }
  }

  async $onInit() {
    this.configs = [];
    this.getConfigs();
  }

  async removeAction(selectedItems) {
    const confirmed = await confirmDelete('您是否要删除选中的配置？');
    if (!confirmed) {
      return null;
    }
    return this.$async(this.removeActionAsync, selectedItems);
  }

  async removeActionAsync(selectedItems) {
    let actionCount = selectedItems.length;
    for (const config of selectedItems) {
      try {
        await this.ConfigService.remove(this.endpoint.Id, config.Id);
        this.Notifications.success('配置成功删除', config.Name);
        const index = this.configs.indexOf(config);
        this.configs.splice(index, 1);
      } catch (err) {
        this.Notifications.error('失败', err, '无法删除配置');
      } finally {
        --actionCount;
        if (actionCount === 0) {
          this.$state.reload();
        }
      }
    }
  }
}
export default ConfigsController;
angular.module('portainer.docker').controller('ConfigsController', ConfigsController);
