import { getEnvironments } from '@/portainer/environments/environment.service';

angular.module('portainer.app').controller('InitAdminController', [
  '$scope',
  '$state',
  'Notifications',
  'Authentication',
  'StateManager',
  'SettingsService',
  'UserService',
  'BackupService',
  'StatusService',
  function ($scope, $state, Notifications, Authentication, StateManager, SettingsService, UserService, BackupService, StatusService) {
    $scope.uploadBackup = uploadBackup;

    $scope.logo = StateManager.getState().application.logo;

    $scope.formValues = {
      Username: 'admin',
      Password: '',
      ConfirmPassword: '',
      enableTelemetry: process.env.NODE_ENV === 'production',
    };

    $scope.state = {
      actionInProgress: false,
      showInitPassword: true,
      showRestorePortainer: false,
    };

    createAdministratorFlow();

    $scope.togglePanel = function () {
      $scope.state.showInitPassword = !$scope.state.showInitPassword;
      $scope.state.showRestorePortainer = !$scope.state.showRestorePortainer;
    };

    $scope.createAdminUser = function () {
      var username = $scope.formValues.Username;
      var password = $scope.formValues.Password;

      $scope.state.actionInProgress = true;
      UserService.initAdministrator(username, password)
        .then(function success() {
          return Authentication.login(username, password);
        })
        .then(function success() {
          return SettingsService.update({ enableTelemetry: $scope.formValues.enableTelemetry });
        })
        .then(() => {
          return StateManager.initialize();
        })
        .then(function () {
          return getEnvironments({ limit: 100 });
        })
        .then(function success(data) {
          if (data.value.length === 0) {
            $state.go('portainer.wizard');
          } else {
            $state.go('portainer.home');
          }
        })
        .catch(function error(err) {
          handleError(err);
          Notifications.error('失败', err, '无法创建管理员用户');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    function handleError(err) {
      if (err.status === 303) {
        const headers = err.headers();
        const REDIRECT_REASON_TIMEOUT = 'AdminInitTimeout';
        if (headers && headers['redirect-reason'] === REDIRECT_REASON_TIMEOUT) {
          window.location.href = '/timeout.html';
        }
      }
    }

    function createAdministratorFlow() {
      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.requiredPasswordLength = data.RequiredPasswordLength;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });

      UserService.administratorExists()
        .then(function success(exists) {
          if (exists) {
            $state.go('portainer.wizard');
          }
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法验证管理员账户的存在');
        });
    }

    async function uploadBackup() {
      $scope.state.backupInProgress = true;

      const file = $scope.formValues.BackupFile;
      const password = $scope.formValues.Password;

      restoreAndRefresh(() => BackupService.uploadBackup(file, password));
    }

    async function restoreAndRefresh(restoreAsyncFn) {
      $scope.state.backupInProgress = true;

      try {
        await restoreAsyncFn();
      } catch (err) {
        handleError(err);
        Notifications.error('失败', err, '无法恢复备份');
        $scope.state.backupInProgress = false;

        return;
      }

      try {
        await waitPortainerRestart();
        Notifications.success('Success', '备份已经成功恢复了');
        $state.go('portainer.auth');
      } catch (err) {
        handleError(err);
        Notifications.error('失败', err, '无法检查状态');
        await wait(2);
        location.reload();
      }

      $scope.state.backupInProgress = false;
    }

    async function waitPortainerRestart() {
      for (let i = 0; i < 10; i++) {
        await wait(5);
        try {
          const status = await StatusService.status();
          if (status && status.Version) {
            return;
          }
        } catch (e) {
          // pass
        }
      }
      throw new Error('等待Portainer重新启动的超时时间');
    }
  },
]);

function wait(seconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
