import { ResourceControlType } from '@/react/portainer/access-control/types';
import { confirmDelete } from '@@/modals/confirm';

angular.module('portainer.docker').controller('VolumeController', [
  '$scope',
  '$state',
  '$transition$',
  'VolumeService',
  'ContainerService',
  'Notifications',
  'HttpRequestHelper',
  function ($scope, $state, $transition$, VolumeService, ContainerService, Notifications, HttpRequestHelper) {
    $scope.resourceType = ResourceControlType.Volume;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.removeVolume = function removeVolume() {
      confirmDelete('您是否要删除此存储卷？').then((confirmed) => {
        if (confirmed) {
          VolumeService.remove($scope.volume)
            .then(function success() {
              Notifications.success('存储卷删除成功', $transition$.params().id);
              $state.go('docker.volumes', {});
            })
            .catch(function error(err) {
              Notifications.error('失败', err, '无法删除存储卷');
            });
        }
      });
    };

    function getVolumeDataFromContainer(container, volumeId) {
      return container.Mounts.find(function (volume) {
        return volume.Name === volumeId;
      });
    }

    function initView() {
      HttpRequestHelper.setPortainerAgentTargetHeader($transition$.params().nodeName);

      VolumeService.volume($transition$.params().id)
        .then(function success(data) {
          var volume = data;
          $scope.volume = volume;
          var containerFilter = { volume: [volume.Id] };

          return ContainerService.containers(1, containerFilter);
        })
        .then(function success(data) {
          var dataContainers = $scope.isCioDriver ? data.containers : data;

          var containers = dataContainers.map(function (container) {
            container.volumeData = getVolumeDataFromContainer(container, $scope.volume.Id);
            return container;
          });
          $scope.containersUsingVolume = containers;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索存储卷详情');
        });
    }

    initView();
  },
]);
