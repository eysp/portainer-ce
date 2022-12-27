angular.module('portainer.docker').controller('DashboardClusterAgentInfoController', [
  'AgentService',
  'Notifications',
  function (AgentService, Notifications) {
    var ctrl = this;

    this.$onInit = function () {
      AgentService.agents()
        .then(function success(data) {
          ctrl.agentCount = data.length;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, 'Unable to retrieve agent information');
        });
    };
  },
]);
