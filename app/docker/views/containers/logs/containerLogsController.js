import moment from 'moment';

angular.module('portainer.docker').controller('ContainerLogsController', [
  '$scope',
  '$transition$',
  '$interval',
  'ContainerService',
  'Notifications',
  'HttpRequestHelper',
  function ($scope, $transition$, $interval, ContainerService, Notifications, HttpRequestHelper) {
    $scope.state = {
      refreshRate: 3,
      lineCount: 100,
      sinceTimestamp: '',
      displayTimestamps: false,
    };

    $scope.changeLogCollection = function (logCollectionStatus) {
      if (!logCollectionStatus) {
        stopRepeater();
      } else {
        setUpdateRepeater(!$scope.container.Config.Tty);
      }
    };

    $scope.$on('$destroy', function () {
      stopRepeater();
    });

    function stopRepeater() {
      var repeater = $scope.repeater;
      if (angular.isDefined(repeater)) {
        $interval.cancel(repeater);
        repeater = null;
      }
    }

    function setUpdateRepeater(skipHeaders) {
      var refreshRate = $scope.state.refreshRate;
      $scope.repeater = $interval(function () {
        ContainerService.logs(
          $transition$.params().id,
          1,
          1,
          $scope.state.displayTimestamps ? 1 : 0,
          moment($scope.state.sinceTimestamp).unix(),
          $scope.state.lineCount,
          skipHeaders
        )
          .then(function success(data) {
            $scope.logs = data;
          })
          .catch(function error(err) {
            stopRepeater();
            Notifications.error('失败', err, '无法检索容器日志');
          });
      }, refreshRate * 1000);
    }

    function startLogPolling(skipHeaders) {
      ContainerService.logs($transition$.params().id, 1, 1, $scope.state.displayTimestamps ? 1 : 0, moment($scope.state.sinceTimestamp).unix(), $scope.state.lineCount, skipHeaders)
        .then(function success(data) {
          $scope.logs = data;
          setUpdateRepeater(skipHeaders);
        })
        .catch(function error(err) {
          stopRepeater();
          Notifications.error('失败', err, '无法检索容器日志');
        });
    }

    function initView() {
      HttpRequestHelper.setPortainerAgentTargetHeader($transition$.params().nodeName);
      ContainerService.container($transition$.params().id)
        .then(function success(data) {
          var container = data;
          $scope.container = container;
          startLogPolling(!container.Config.Tty);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索容器信息');
        });
    }

    initView();
  },
]);
