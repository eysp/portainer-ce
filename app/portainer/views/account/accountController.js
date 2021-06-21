angular.module('portainer.app').controller('AccountController', [
  '$scope',
  '$state',
  'Authentication',
  'UserService',
  'Notifications',
  'SettingsService',
  function ($scope, $state, Authentication, UserService, Notifications, SettingsService) {
    $scope.formValues = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    $scope.updatePassword = function () {
      UserService.updateUserPassword($scope.userID, $scope.formValues.currentPassword, $scope.formValues.newPassword)
        .then(function success() {
          Notifications.success('成功', '密码更新成功');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, err.msg);
        });
    };

    function initView() {
      $scope.userID = Authentication.getUserDetails().ID;
      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.AuthenticationMethod = data.AuthenticationMethod;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });
    }

    initView();
  },
]);
