angular.module('portainer.azure').controller('AzureDashboardController', [
  '$scope',
  'AzureService',
  'Notifications',
  function ($scope, AzureService, Notifications) {
    function initView() {
      AzureService.subscriptions()
        .then(function success(data) {
          var subscriptions = data;
          $scope.subscriptions = subscriptions;
          return AzureService.resourceGroups(subscriptions);
        })
        .then(function success(data) {
          $scope.resourceGroups = AzureService.aggregate(data);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法加载仪表板数据');
        });
    }

    initView();
  },
]);
