angular.module('portainer.docker').controller('ContainerInspectController', [
  '$scope',
  '$transition$',
  'Notifications',
  'ContainerService',
  'HttpRequestHelper',
  function ($scope, $transition$, Notifications, ContainerService, HttpRequestHelper) {
    $scope.state = {
      DisplayTextView: false,
    };
    $scope.containerInfo = {};

    function initView() {
      HttpRequestHelper.setPortainerAgentTargetHeader($transition$.params().nodeName);
      ContainerService.inspect($transition$.params().id)
        .then(function success(d) {
          $scope.containerInfo = d;
        })
        .catch(function error(e) {
          Notifications.error('失败', e, '无法检查容器');
        });
    }

    initView();
  },
]);
