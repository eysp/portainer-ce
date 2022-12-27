angular.module('portainer.app').controller('UserController', [
  '$q',
  '$scope',
  '$state',
  '$transition$',
  'UserService',
  'ModalService',
  'Notifications',
  'SettingsService',
  'Authentication',
  function ($q, $scope, $state, $transition$, UserService, ModalService, Notifications, SettingsService, Authentication) {
    $scope.state = {
      updatePasswordError: '',
    };

    $scope.formValues = {
      username: '',
      newPassword: '',
      confirmPassword: '',
      Administrator: false,
    };

    $scope.handleAdministratorChange = function (checked) {
      return $scope.$evalAsync(() => {
        $scope.formValues.Administrator = checked;
      });
    };

    $scope.deleteUser = function () {
      ModalService.confirmDeletion('你想删除这个用户吗？这个用户将不能再登录到Portainer。', function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        deleteUser();
      });
    };

    $scope.updateUser = async function () {
      const role = $scope.formValues.Administrator ? 1 : 2;
      const oldUsername = $scope.user.Username;
      const username = $scope.formValues.username;
      let promise = Promise.resolve(true);
      if (username != oldUsername) {
        promise = new Promise((resolve) =>
          ModalService.confirmWarn({
            title: '你确定吗？',
            message: `你确定你要把用户 ${oldUsername} 重命名为 ${username} 吗?`,
            buttons: {
              confirm: {
                label: 'Update',
                className: 'btn-primary',
              },
            },
            callback: resolve,
          })
        );
      }
      const confirmed = await promise;
      if (!confirmed) {
        return;
      }
      UserService.updateUser($scope.user.Id, { role, username })
        .then(function success() {
          Notifications.success('Success', '用户成功更新');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新用户权限');
        });
    };

    $scope.updatePassword = async function () {
      const isCurrentUser = Authentication.getUserDetails().ID === $scope.user.Id;
      const confirmed = !isCurrentUser || (await ModalService.confirmChangePassword());
      if (!confirmed) {
        return;
      }
      UserService.updateUser($scope.user.Id, { password: $scope.formValues.newPassword })
        .then(function success() {
          Notifications.success('Success', '密码成功更新');

          if (isCurrentUser) {
            $state.go('portainer.logout');
          } else {
            $state.reload();
          }
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新用户密码');
        });
    };

    function deleteUser() {
      UserService.deleteUser($scope.user.Id)
        .then(function success() {
          Notifications.success('用户成功删除', $scope.user.Username);
          $state.go('portainer.users');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除用户');
        });
    }

    $scope.isSubmitEnabled = isSubmitEnabled;
    function isSubmitEnabled() {
      const { user, formValues } = $scope;
      return user && (user.Username !== formValues.username || (formValues.Administrator && user.Role !== 1) || (!formValues.Administrator && user.Role === 1));
    }

    $scope.isDeleteDisabled = isDeleteDisabled;
    function isDeleteDisabled() {
      const { user } = $scope;
      return user && user.Id === 1;
    }

    function initView() {
      $scope.isAdmin = Authentication.isAdmin();

      $q.all({
        user: UserService.user($transition$.params().id),
        settings: SettingsService.publicSettings(),
      })
        .then(function success(data) {
          var user = data.user;
          $scope.user = user;
          $scope.formValues.Administrator = user.Role === 1;
          $scope.formValues.username = user.Username;
          $scope.AuthenticationMethod = data.settings.AuthenticationMethod;
          $scope.requiredPasswordLength = data.settings.RequiredPasswordLength;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索到用户信息');
        });
    }

    initView();
  },
]);
