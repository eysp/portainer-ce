import moment from 'moment';

angular.module('portainer.docker').controller('EventsController', [
  '$scope',
  'Notifications',
  'SystemService',
  function ($scope, Notifications, SystemService) {
    function initView() {
      var from = moment().subtract(24, 'hour').unix();
      var to = moment().unix();

      SystemService.events(from, to)
        .then(function success(data) {
          $scope.events = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法加载事件');
        });
    }

    initView();
  },
]);
