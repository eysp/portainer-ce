import { RegistryTypes } from '@/portainer/models/registryTypes';

angular.module('portainer.app').controller('RegistryController', [
  '$scope',
  '$state',
  'RegistryService',
  'Notifications',
  function ($scope, $state, RegistryService, Notifications) {
    $scope.state = {
      actionInProgress: false,
    };

    $scope.formValues = {
      Password: '',
    };

    $scope.RegistryTypes = RegistryTypes;

    $scope.updateRegistry = function () {
      var registry = $scope.registry;
      registry.Password = $scope.formValues.Password;
      $scope.state.actionInProgress = true;
      RegistryService.updateRegistry(registry)
        .then(function success() {
          Notifications.success('注册表已成功更新');
          $state.go('portainer.registries');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新注册表');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    function initView() {
      var registryID = $state.params.id;
      RegistryService.registry(registryID)
        .then(function success(data) {
          $scope.registry = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索注册表详细信息');
        });
    }

    initView();
  },
]);
