import { confirmDelete } from '@@/modals/confirm';

import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.docker').controller('VolumesController', [
  '$q',
  '$scope',
  '$state',
  'VolumeService',
  'ServiceService',
  'VolumeHelper',
  'Notifications',
  'Authentication',
  'endpoint',
  function ($q, $scope, $state, VolumeService, ServiceService, VolumeHelper, Notifications, Authentication, endpoint) {
    $scope.removeAction = function (selectedItems) {
      confirmDelete('您确定要删除选定的存储卷吗？').then(async (confirmed) => {
        async function doRemove(volume) {
          return VolumeService.remove(volume.Id, volume.NodeName)
            .then(function success() {
              Notifications.success('卷已成功删除', volume.Id);
              var index = $scope.volumes.indexOf(volume);
              $scope.volumes.splice(index, 1);
            })
            .catch(function error(err) {
              Notifications.error('失败', err, '无法删除卷');
            });
        }

        if (confirmed) {
          await processItemsInBatches(selectedItems, doRemove);
          $state.reload();
        }
      });
    };

    $scope.getVolumes = getVolumes;
    function getVolumes() {
      var endpointProvider = $scope.applicationState.endpoint.mode.provider;
      var endpointRole = $scope.applicationState.endpoint.mode.role;

      $q.all({
        attached: VolumeService.volumes({ dangling: ['false'] }),
        dangling: VolumeService.volumes({ dangling: ['true'] }),
        services: endpointProvider === 'DOCKER_SWARM_MODE' && endpointRole === 'MANAGER' ? ServiceService.services() : [],
      })
        .then(function success(data) {
          var services = data.services;
          $scope.volumes = data.attached
            .map(function (volume) {
              volume.dangling = false;
              return volume;
            })
            .concat(
              data.dangling.map(function (volume) {
                volume.dangling = true;
                if (VolumeHelper.isVolumeUsedByAService(volume, services)) {
                  volume.dangling = false;
                }
                return volume;
              })
            );
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索卷信息');
        });
    }

    function initView() {
      getVolumes();

      $scope.showBrowseAction = $scope.applicationState.endpoint.mode.agentProxy && (Authentication.isAdmin() || endpoint.SecuritySettings.allowVolumeBrowserForRegularUsers);
    }

    initView();
  },
]);
