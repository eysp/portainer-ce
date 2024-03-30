angular.module('portainer.docker').controller('TaskController', [
  '$scope',
  '$transition$',
  'TaskService',
  'ServiceService',
  'Notifications',
  function ($scope, $transition$, TaskService, ServiceService, Notifications) {
    function initView() {
      TaskService.task($transition$.params().id)
        .then(function success(data) {
          var task = data;
          $scope.task = task;
          return ServiceService.service(task.ServiceId);
        })
        .then(function success(data) {
          var service = data;
          $scope.service = service;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, '无法获取任务详情');
        });
    }

    initView();
  },
]);
