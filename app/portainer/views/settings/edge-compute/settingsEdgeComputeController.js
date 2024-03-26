import angular from 'angular';

import { configureFDO } from '@/portainer/hostmanagement/fdo/fdo.service';
import { configureAMT } from 'Portainer/hostmanagement/open-amt/open-amt.service';

angular.module('portainer.app').controller('SettingsEdgeComputeController', SettingsEdgeComputeController);

/* @ngInject */
export default function SettingsEdgeComputeController($q, $async, $state, Notifications, SettingsService, StateManager) {
  var ctrl = this;

  this.onSubmitEdgeCompute = async function (settings) {
    try {
      await SettingsService.update(settings);
      Notifications.success('成功', '设置已更新');
      StateManager.updateEnableEdgeComputeFeatures(settings.EnableEdgeComputeFeatures);
      $state.reload();
    } catch (err) {
      Notifications.error('失败', err, '无法更新设置');
    }
  };

  this.onSubmitOpenAMT = async function (formValues) {
    try {
      await configureAMT(formValues);
      Notifications.success('成功', `OpenAMT已成功${formValues.enabled ? '启用' : '禁用'}`);
      $state.reload();
    } catch (err) {
      Notifications.error('失败', err, '应用更改失败');
    }
  };

  this.onSubmitFDO = async function (formValues) {
    try {
      await configureFDO(formValues);
      Notifications.success('成功', `FDO已成功${formValues.enabled ? '启用' : '禁用'}`);
      $state.reload();
    } catch (err) {
      Notifications.error('失败', err, '应用更改失败');
    }
  };

  function initView() {
    $async(async () => {
      try {
        ctrl.settings = await SettingsService.settings();
      } catch (err) {
        Notifications.error('失败', err, '无法检索应用程序设置');
      }
    });
  }

  initView();
}
