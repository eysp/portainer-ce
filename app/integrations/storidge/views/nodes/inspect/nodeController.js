angular.module('portainer.integrations.storidge').controller('StoridgeNodeController', [
  '$scope',
  '$state',
  '$transition$',
  'Notifications',
  'StoridgeNodeService',
  'ModalService',
  function ($scope, $state, $transition$, Notifications, StoridgeNodeService, ModalService) {
    $scope.removeNodeAction = function (selectedItems) {
      ModalService.confirm({
        title: '你确定吗？',
        message: '您真的要从集群中删除节点吗？',
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
          remove(selectedItems);
        },
      });
    };

    function remove() {
      StoridgeNodeService.remove($scope.node.Name)
        .then(function success() {
          Notifications.success('节点成功删除', $scope.node.Name);
          $state.go('storidge.cluster');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除节点');
        });
    }

    $scope.cordonNodeAction = function (selectedItems) {
      ModalService.confirm({
        title: '你确定吗？',
        message: '您真的想将节点置于维护模式吗？',
        buttons: {
          confirm: {
            label: '进入维护',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          cordonNode(selectedItems);
        },
      });
    };

    function cordonNode() {
      StoridgeNodeService.cordon($scope.node.Name)
        .then(function success() {
          Notifications.success('节点成功进入维护');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法将节点置于维护模式');
        })
        .finally(function final() {
          $state.reload();
        });
    }

    $scope.uncordonNodeAction = function (selectedItems) {
      ModalService.confirm({
        title: '你确定吗？',
        message: '您真的想让节点退出维护模式吗？',
        buttons: {
          confirm: {
            label: '退出维护',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          uncordonNode(selectedItems);
        },
      });
    };

    function uncordonNode() {
      StoridgeNodeService.uncordon($scope.node.Name)
        .then(function success() {
          Notifications.success('节点成功恢复');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法将节点置于维护模式');
        })
        .finally(function final() {
          $state.reload();
        });
    }

    function initView() {
      $scope.name = $transition$.params().name;

      StoridgeNodeService.node($scope.name)
        .then(function success(data) {
          $scope.node = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索节点详细信息');
        });
    }

    initView();
  },
]);
