angular.module('portainer.docker').controller('StoridgeSnapshotCreationController', [
  'StoridgeSnapshotService',
  'Notifications',
  '$state',
  function (StoridgeSnapshotService, Notifications, $state) {
    var ctrl = this;

    this.formValues = {};
    this.state = {
      actionInProgress: false,
    };

    this.createSnapshot = function () {
      ctrl.state.actionInProgress = true;
      StoridgeSnapshotService.create(ctrl.volumeId, ctrl.formValues.Description)
        .then(function success() {
          Notifications.success('成功', '快照创建成功');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法创建快照');
        })
        .finally(function final() {
          ctrl.state.actionInProgress = false;
        });
    };
  },
]);
