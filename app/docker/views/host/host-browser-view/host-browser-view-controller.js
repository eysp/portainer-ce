angular.module('portainer.docker').controller('HostBrowserViewController', [
  'SystemService',
  'Notifications',
  function HostBrowserViewController(SystemService, Notifications) {
    var ctrl = this;
    ctrl.$onInit = $onInit;

    function $onInit() {
      SystemService.info()
        .then(function onInfoLoaded(host) {
          ctrl.host = host;
        })
        .catch(function onError(err) {
          Notifications.error('无法检索到主机信息', err);
        });
    }
  },
]);
