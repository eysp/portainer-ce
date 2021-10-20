angular.module('portainer.integrations.storidge').controller('StoridgeDriveController', [
  '$scope',
  '$state',
  '$transition$',
  'Notifications',
  'ModalService',
  'StoridgeDriveService',
  function ($scope, $state, $transition$, Notifications, ModalService, StoridgeDriveService) {
    $scope.actionInProgress = false;

    $scope.removeDrive = function () {
      ModalService.confirm({
        title: '你确定吗？',
        message: '您真的要从存储池中删除此驱动器吗？',
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
          $scope.actionInProgress = true;
          StoridgeDriveService.remove($scope.drive.Id)
            .then(function () {
              Notifications.success('成功', '从存储池中删除驱动器');
              $state.go('storidge.drives', {}, { reload: true });
            })
            .catch(function error(err) {
              Notifications.error('失败', err, '无法从存储池中删除驱动器');
            })
            .finally(function final() {
              $scope.actionInProgress = false;
            });
        },
      });
    };

    function initView() {
      $scope.id = $transition$.params().id;

      StoridgeDriveService.drive($scope.id)
        .then(function success(data) {
          $scope.drive = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索驱动器详细信息');
        });
    }

    initView();
  },
]);
