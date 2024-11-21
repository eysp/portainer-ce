import { ResourceControlType } from '@/react/portainer/access-control/types';

angular.module('portainer.docker').controller('ConfigController', [
  '$scope',
  '$transition$',
  '$state',
  'ConfigService',
  'Notifications',
  'endpoint',
  function ($scope, $transition$, $state, ConfigService, Notifications, endpoint) {
    $scope.resourceType = ResourceControlType.Config;
    $scope.endpoint = endpoint;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.removeConfig = function removeConfig(configId) {
      ConfigService.remove(endpoint.Id, configId)
        .then(function success() {
          Notifications.success('成功', '配置成功删除');
          $state.go('docker.configs', {});
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除配置');
        });
    };

    function initView() {
      ConfigService.config(endpoint.Id, $transition$.params().id)
        .then(function success(data) {
          $scope.config = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法获取配置详情');
        });
    }

    initView();
  },
]);
