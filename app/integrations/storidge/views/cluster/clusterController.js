angular.module('portainer.integrations.storidge').controller('StoridgeClusterController', [
  '$q',
  '$scope',
  '$state',
  'Notifications',
  'StoridgeClusterService',
  'StoridgeNodeService',
  'ModalService',
  function ($q, $scope, $state, Notifications, StoridgeClusterService, StoridgeNodeService, ModalService) {
    $scope.state = {
      shutdownInProgress: false,
      rebootInProgress: false,
    };

    $scope.rebootCluster = function () {
      ModalService.confirm({
        title: '你确定吗？',
        message: '在此过程中，集群中的所有节点都将重新启动。 是否要重新启动 Storridge 集群？',
        buttons: {
          confirm: {
            label: '重启',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          rebootCluster();
        },
      });
    };

    function rebootCluster() {
      $scope.state.rebootInProgress = true;
      StoridgeClusterService.reboot().finally(function final() {
        $scope.state.rebootInProgress = false;
        Notifications.success('集群成功重启');
        $state.reload();
      });
    }

    $scope.shutdownCluster = function () {
      ModalService.confirm({
        title: '你确定吗？',
        message: '集群中的所有节点都将关闭。 您要关闭存储集群吗？',
        buttons: {
          confirm: {
            label: '关闭',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          shutdownCluster();
        },
      });
    };

    function shutdownCluster() {
      $scope.state.shutdownInProgress = true;
      StoridgeClusterService.shutdown().finally(function final() {
        $scope.state.shutdownInProgress = false;
        Notifications.success('集群成功关闭');
        $state.go('docker.dashboard');
      });
    }

    function initView() {
      $q.all({
        info: StoridgeClusterService.info(),
        version: StoridgeClusterService.version(),
        nodes: StoridgeNodeService.nodes(),
      })
        .then(function success(data) {
          $scope.clusterInfo = data.info;
          $scope.clusterVersion = data.version;
          $scope.clusterNodes = data.nodes;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索集群信息');
        });
    }

    initView();
  },
]);
