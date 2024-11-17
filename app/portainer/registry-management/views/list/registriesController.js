import _ from 'lodash-es';
import { confirmDelete } from '@@/modals/confirm';
import { RegistryTypes } from 'Portainer/models/registryTypes';
import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.app').controller('RegistriesController', [
  '$q',
  '$scope',
  '$state',
  'RegistryService',
  'Notifications',
  function ($q, $scope, $state, RegistryService, Notifications) {
    $scope.state = {
      actionInProgress: false,
    };

    const nonBrowsableTypes = [RegistryTypes.ANONYMOUS, RegistryTypes.DOCKERHUB, RegistryTypes.QUAY];

    $scope.canBrowse = function (item) {
      return !_.includes(nonBrowsableTypes, item.Type);
    };

    $scope.removeAction = function (selectedItems) {
      const regAttrMsg = selectedItems.length > 1 ? '这些' : '这个';
      const registriesMsg = selectedItems.length > 1 ? '仓库' : '仓库';
      const msg = `T${regAttrMsg} ${registriesMsg} 可能被一个或多个环境内的应用程序使用。删除 ${registriesMsg} 可能会导致使用 t${regAttrMsg} ${registriesMsg} 的应用程序的服务中断。是否要删除选定的 ${registriesMsg}？`;

      confirmDelete(msg).then((confirmed) => {
        if (!confirmed) {
          return;
        }
        deleteSelectedRegistries(selectedItems);
      });
    };

    async function deleteSelectedRegistries(selectedItems) {
      async function doRemove(registry) {
        return RegistryService.deleteRegistry(registry.Id)
          .then(function success() {
            Notifications.success('注册表成功删除', registry.Name);
            var index = $scope.registries.indexOf(registry);
            $scope.registries.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除注册表');
          });
      }

      await processItemsInBatches(selectedItems, doRemove);
      $state.reload();
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
          Notifications.error('失败', err, '无法获取注册表');
        });
    }

    initView();
  },
]);
