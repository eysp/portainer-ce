import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { confirm, confirmChangePassword, confirmDelete } from '@@/modals/confirm';

angular.module('portainer.app').controller('UserController', [
  '$q',
  '$scope',
  '$state',
  '$transition$',
  'UserService',
  'Notifications',
  'SettingsService',
  'Authentication',
  function ($q, $scope, $state, $transition$, UserService, Notifications, SettingsService, Authentication) {
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
      confirmDelete('您确定要删除此用户吗？删除后该用户将无法再登录Portainer。').then((confirmed) => {
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

      if (username != oldUsername) {
        const confirmed = await confirm({
          title: '您确定吗？',
          modalType: ModalType.Warn,
          message: `您确定要将用户名 ${oldUsername} 更改为 ${username} 吗？?`,
          confirmButton: buildConfirmButton('更新'),
        });

        if (!confirmed) {
          return;
        }
      }

      UserService.updateUser($scope.user.Id, { role, username })
        .then(function success() {
          Notifications.success('成功', '用户更新成功');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新用户权限');
        });
    };

    $scope.updatePassword = async function () {
      const isCurrentUser = Authentication.getUserDetails().ID === $scope.user.Id;
      const confirmed = !isCurrentUser || (await confirmChangePassword());
      if (!confirmed) {
        return;
      }
      UserService.updateUser($scope.user.Id, { newPassword: $scope.formValues.newPassword })
        .then(function success() {
          Notifications.success('成功', '密码更新成功');

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
          Notifications.success('用户删除成功', $scope.user.Username);
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
          Notifications.error('失败', err, '无法获取用户信息on');
        });
    }

    initView();
  },
]);
