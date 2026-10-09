import _ from 'lodash-es';
import angular from 'angular';

angular.module('portainer.app').controller('SettingsEdgeComputeController', SettingsEdgeComputeController);

/* @ngInject */
export default function SettingsEdgeComputeController($q, $async, $state, Notifications, SettingsService, StateManager) {
  var ctrl = this;

  this.onSubmitEdgeCompute = async function (settings) {
    try {
      await SettingsService.update(settings);
      Notifications.success('Success', '设置已更新');
      StateManager.updateEnableEdgeComputeFeatures(settings.EnableEdgeComputeFeatures);
      $state.reload();
    } catch (err) {
      Notifications.error('Failure', err, '无法更新设置');
    }
  };

  function initView() {
    $async(async () => {
      try {
        const settings = await SettingsService.settings();

        const defaultMTLS = {
          ..._.get(settings, 'Edge.MTLS', {}),
          UseSeparateCert: _.get(settings, 'Edge.MTLS.UseSeparateCert', false),
        };

        ctrl.settings = {
          ...settings,
          EnableEdgeComputeFeatures: !!settings.EnableEdgeComputeFeatures,
          EnforceEdgeID: !!settings.EnforceEdgeID,
          Edge: {
            ...settings.Edge,
            MTLS: defaultMTLS,
          },
        };
      } catch (err) {
        Notifications.error('Failure', err, '无法获取应用设置');
      }
    });
  }

  initView();
}
