import _ from 'lodash-es';
import { RegistryTypes } from 'Portainer/models/registryTypes';

angular.module('portainer.app').controller('RegistriesController', [
  '$q',
  '$scope',
  '$state',
  'RegistryService',
  'ModalService',
  'Notifications',
  function ($q, $scope, $state, RegistryService, ModalService, Notifications) {
    $scope.state = {
      actionInProgress: false,
    };

    const nonBrowsableTypes = [RegistryTypes.ANONYMOUS, RegistryTypes.DOCKERHUB, RegistryTypes.QUAY];

    $scope.canBrowse = function (item) {
      return !_.includes(nonBrowsableTypes, item.Type);
    };

    $scope.removeAction = function (selectedItems) {
      const regAttrMsg = selectedItems.length > 1 ? 'hese' : 'his';
      const registriesMsg = selectedItems.length > 1 ? 'registries' : 'registry';
      const msg = `T${regAttrMsg} ${registriesMsg} 可能被一个或多个环境中的应用程序使用。删除 ${registriesMsg} 可能导致使用 t${regAttrMsg} ${registriesMsg}. 的应用程序的服务中断。您是否想移除所选的 ${registriesMsg}?`;

      ModalService.confirmDeletion(msg, function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        deleteSelectedRegistries(selectedItems);
      });
    };

    function deleteSelectedRegistries(selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (registry) {
        RegistryService.deleteRegistry(registry.Id)
          .then(function success() {
            Notifications.success('Registry successfully removed', registry.Name);
            var index = $scope.registries.indexOf(registry);
            $scope.registries.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, 'Unable to remove registry');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function initView() {
      $q.all({
        registries: RegistryService.registries(),
      })
        .then(function success(data) {
          $scope.registries = data.registries;
        })
        .catch(function error(err) {
          $scope.registries = [];
          Notifications.error('失败', err, 'Unable to retrieve registries');
        });
    }

    initView();
  },
]);
