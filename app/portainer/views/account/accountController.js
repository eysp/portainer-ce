angular.module('portainer.app').controller('AccountController', [
  '$scope',
  '$state',
  'Authentication',
  'UserService',
  'Notifications',
  'SettingsService',
  'StateManager',
  'ThemeManager',
  'ModalService',
  function ($scope, $state, Authentication, UserService, Notifications, SettingsService, StateManager, ThemeManager, ModalService) {
    $scope.formValues = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      userTheme: '',
    };

    $scope.updatePassword = async function () {
      const confirmed = await ModalService.confirmChangePassword();
      if (confirmed) {
        try {
          await UserService.updateUserPassword($scope.userID, $scope.formValues.currentPassword, $scope.formValues.newPassword);
          Notifications.success('Success', 'Password successfully updated');
          StateManager.resetPasswordChangeSkips($scope.userID.toString());
          $scope.forceChangePassword = false;
          $state.go('portainer.logout');
        } catch (err) {
          Notifications.error('失败', err, err.msg);
        }
      }
    };

    $scope.skipPasswordChange = async function () {
      try {
        if ($scope.userCanSkip()) {
          StateManager.setPasswordChangeSkipped($scope.userID.toString());
          $scope.forceChangePassword = false;
          $state.go('portainer.home');
        }
      } catch (err) {
        Notifications.error('失败', err, err.msg);
      }
    };

    $scope.userCanSkip = function () {
      return $scope.timesPasswordChangeSkipped < 2;
    };

    this.uiCanExit = (newTransition) => {
      if (newTransition) {
        if ($scope.userRole === 1 && newTransition.to().name === 'portainer.settings.authentication') {
          return true;
        }
        if (newTransition.to().name === 'portainer.logout') {
          return true;
        }
      }
      if ($scope.forceChangePassword) {
        ModalService.confirmForceChangePassword();
      }
      return !$scope.forceChangePassword;
    };

    $scope.uiCanExit = () => {
      return this.uiCanExit();
    };

    $scope.removeAction = (selectedTokens) => {
      const msg = '您是否想删除所选的访问令牌？任何使用这些令牌的脚本或应用程序将不再能够调用Portainer API。';

      ModalService.confirmDeletion(msg, function (confirmed) {
        if (!confirmed) {
          return;
        }
        let actionCount = selectedTokens.length;
        selectedTokens.forEach((token) => {
          UserService.deleteAccessToken($scope.userID, token.id)
            .then(() => {
              Notifications.success('Success', '令牌成功移除');
              var index = $scope.tokens.indexOf(token);
              $scope.tokens.splice(index, 1);
            })
            .catch((err) => {
              Notifications.error('失败', err, '无法删除令牌');
            })
            .finally(() => {
              --actionCount;
              if (actionCount === 0) {
                $state.reload();
              }
            });
        });
      });
    };

    // Update DOM for theme attribute & LocalStorage
    $scope.setTheme = function (theme) {
      ThemeManager.setTheme(theme);
      StateManager.updateTheme(theme);
    };

    // Rest API Call to update theme with userID in DB
    $scope.updateTheme = function () {
      UserService.updateUserTheme($scope.userID, $scope.formValues.userTheme)
        .then(function success() {
          Notifications.success('Success', '用户主题成功更新');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, err.msg);
        });
    };

    async function initView() {
      const state = StateManager.getState();
      const userDetails = Authentication.getUserDetails();
      $scope.userID = userDetails.ID;
      $scope.userRole = Authentication.getUserDetails().role;
      $scope.forceChangePassword = userDetails.forceChangePassword;
      $scope.isInitialAdmin = userDetails.ID === 1;

      if (state.application.demoEnvironment.enabled) {
        $scope.isDemoUser = state.application.demoEnvironment.users.includes($scope.userID);
      }

      const data = await UserService.user($scope.userID);

      $scope.formValues.userTheme = data.UserTheme;

      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.AuthenticationMethod = data.AuthenticationMethod;

          if (state.UI.requiredPasswordLength && state.UI.requiredPasswordLength !== data.RequiredPasswordLength) {
            StateManager.clearPasswordChangeSkips();
          }

          $scope.timesPasswordChangeSkipped =
            state.UI.timesPasswordChangeSkipped && state.UI.timesPasswordChangeSkipped[$scope.userID.toString()]
              ? state.UI.timesPasswordChangeSkipped[$scope.userID.toString()]
              : 0;

          $scope.requiredPasswordLength = data.RequiredPasswordLength;
          StateManager.setRequiredPasswordLength(data.RequiredPasswordLength);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });

      UserService.getAccessTokens($scope.userID)
        .then(function success(data) {
          $scope.tokens = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索到用户令牌');
        });
    }

    initView();
  },
]);
