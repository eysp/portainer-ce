angular.module('portainer.integrations.storidge').controller('StoridgeSnapshotController', [
  '$scope',
  '$state',
  '$transition$',
  'Notifications',
  'ModalService',
  'StoridgeSnapshotService',
  function ($scope, $state, $transition$, Notifications, ModalService, StoridgeSnapshotService) {
    $scope.removeSnapshot = function () {
      ModalService.confirm({
        title: '你确定？',
        message: '您真的要删除此快照吗？',
        buttons: {
          confirm: {
            label: 'Remove',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          StoridgeSnapshotService.remove($scope.snapshot.Id)
            .then(function () {
              Notifications.success('Success', 'Snapshot removed');
              $state.go('portainer.volumes.volume', { id: $scope.volumeId });
            })
            .catch(function error(err) {
              Notifications.error('Failure', err, '无法删除快照');
            });
        },
      });
    };

    function initView() {
      $scope.volumeId = $transition$.params().id;
      $scope.snapshotId = $transition$.params().snapshotId;

      StoridgeSnapshotService.snapshot($scope.snapshotId)
        .then(function success(data) {
          $scope.snapshot = data;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, '无法检索快照详细信息');
        });
    }

    initView();
  },
]);
