import { ResourceControlType } from '@/react/portainer/access-control/types';

angular.module('portainer.docker').controller('ConfigController', [
  '$scope',
  '$transition$',
  '$state',
  'ConfigService',
  'Notifications',
  function ($scope, $transition$, $state, ConfigService, Notifications) {
    $scope.resourceType = ResourceControlType.Config;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.removeConfig = function removeConfig(configId) {
      ConfigService.remove(configId)
        .then(function success() {
          Notifications.success('成功', '配置已成功删除');
          $state.go('docker.configs', {});
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除配置');
        });
    };

    function initView() {
      ConfigService.config($transition$.params().id)
        .then(function success(data) {
          $scope.config = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索配置详情');
        });
    }

    initView();
  },
]);
