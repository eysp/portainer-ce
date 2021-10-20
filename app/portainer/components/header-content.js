angular.module('portainer.app').directive('rdHeaderContent', [
  'Authentication',
  function rdHeaderContent(Authentication) {
    var directive = {
      requires: '^rdHeader',
      transclude: true,
      link: function (scope) {
        scope.username = Authentication.getUserDetails().username;
      },
      template:
        '<div class="breadcrumb-links"><div class="pull-left" ng-transclude></div><div class="pull-right" ng-if="username"><a class="fa fa-heartbeat space-right green-icon" href="https://jq.qq.com/?_wv=1027&k=5HqPeR7" target="_blank">汉化: ysp</a>&nbsp;&nbsp;<a ui-sref="portainer.account" style="margin-right: 5px;"><u><i class="fa fa-wrench" aria-hidden="true"></i> 我的账户 </u></a><a ui-sref="portainer.logout({performApiLogout: true})" class="text-danger" style="margin-right: 25px;" data-cy="template-logoutButton"><u><i class="fa fa-sign-out-alt" aria-hidden="true"></i> 退出登陆</u></a></div></div>',
      restrict: 'E',
    };
    return directive;
  },
]);
