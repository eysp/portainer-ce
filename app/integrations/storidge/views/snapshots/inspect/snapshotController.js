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
        title: '你确定吗？',
        message: '您真的要删除此快照吗？?',
        buttons: {
          confirm: {
            label: '删除',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          StoridgeSnapshotService.remove($scope.snapshot.Id)
            .then(function () {
              Notifications.success('成功', '快照已删除');
              $state.go('portainer.volumes.volume', { id: $scope.volumeId });
            })
            .catch(function error(err) {
              Notifications.error('失败', err, '无法删除快照');
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
          Notifications.error('失败', err, '无法检索快照详细信息');
        });
    }

    initView();
  },
]);
