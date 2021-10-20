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

    $scope.deleteUser = function () {
      ModalService.confirmDeletion('是否要删除此用户？此用户将无法再登录到Portainer。', function onConfirm(confirmed) {
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
          ModalService.confirm({
            title: '你确定吗？',
            message: `您确定要将用户 ${oldUsername} 重命名为 ${username} 吗？`,
            buttons: {
              confirm: {
                label: '更新',
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
          Notifications.success('用户更新成功');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新用户权限');
        });
    };

    $scope.updatePassword = function () {
      UserService.updateUser($scope.user.Id, { password: $scope.formValues.newPassword })
        .then(function success() {
          Notifications.success('密码更新成功');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新用户密码');
        });
    };

    function deleteUser() {
      UserService.deleteUser($scope.user.Id)
        .then(function success() {
          Notifications.success('用户已成功删除', $scope.user.Username);
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
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索用户信息');
        });
    }

    initView();
  },
]);
