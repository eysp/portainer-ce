import { isOfflineEndpoint } from '@/portainer/helpers/endpointHelper';

angular.module('portainer.docker').controller('VolumesController', [
  '$q',
  '$scope',
  '$state',
  'VolumeService',
  'ServiceService',
  'VolumeHelper',
  'Notifications',
  'HttpRequestHelper',
  'Authentication',
  'ModalService',
  'endpoint',
  function ($q, $scope, $state, VolumeService, ServiceService, VolumeHelper, Notifications, HttpRequestHelper, Authentication, ModalService, endpoint) {
    $scope.removeAction = function (selectedItems) {
      ModalService.confirmDeletion('您想删除所选的存储卷吗？', (confirmed) => {
        if (confirmed) {
          var actionCount = selectedItems.length;
          angular.forEach(selectedItems, function (volume) {
            HttpRequestHelper.setPortainerAgentTargetHeader(volume.NodeName);
            VolumeService.remove(volume)
              .then(function success() {
                Notifications.success('存储卷成功删除', volume.Id);
                var index = $scope.volumes.indexOf(volume);
                $scope.volumes.splice(index, 1);
              })
              .catch(function error(err) {
                Notifications.error('失败', err, '无法删除存储卷');
              })
              .finally(function final() {
                --actionCount;
                if (actionCount === 0) {
                  $state.reload();
                }
              });
          });
        }
      });
    };

    $scope.offlineMode = false;

    $scope.getVolumes = getVolumes;
    function getVolumes() {
      var endpointProvider = $scope.applicationState.endpoint.mode.provider;
      var endpointRole = $scope.applicationState.endpoint.mode.role;

      $q.all({
        attached: VolumeService.volumes({ filters: { dangling: ['false'] } }),
        dangling: VolumeService.volumes({ filters: { dangling: ['true'] } }),
        services: endpointProvider === 'DOCKER_SWARM_MODE' && endpointRole === 'MANAGER' ? ServiceService.services() : [],
      })
        .then(function success(data) {
          var services = data.services;
          $scope.offlineMode = isOfflineEndpoint(endpoint);
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
          Notifications.error('失败', err, '无法检索到存储卷');
        });
    }

    function initView() {
      getVolumes();

      $scope.showBrowseAction = $scope.applicationState.endpoint.mode.agentProxy && (Authentication.isAdmin() || endpoint.SecuritySettings.allowVolumeBrowserForRegularUsers);
    }

    initView();
  },
]);
