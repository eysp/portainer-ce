import angular from 'angular';

import { FeatureId } from '@/portainer/feature-flags/enums';
import { options } from './options';

angular.module('portainer.app').controller('SettingsController', [
  '$scope',
  '$state',
  'Notifications',
  'SettingsService',
  'StateManager',
  'BackupService',
  'FileSaver',
  'Blob',
  function ($scope, $state, Notifications, SettingsService, StateManager, BackupService, FileSaver) {
    $scope.customBannerFeatureId = FeatureId.CUSTOM_LOGIN_BANNER;
    $scope.s3BackupFeatureId = FeatureId.S3_BACKUP_SETTING;

    $scope.backupOptions = options;

    $scope.state = {
      isDemo: false,
      actionInProgress: false,
      availableKubeconfigExpiryOptions: [
        {
          key: '1 天',
          value: '24h',
        },
        {
          key: '7 天',
          value: `${24 * 7}h`,
        },
        {
          key: '30 天',
          value: `${24 * 30}h`,
        },
        {
          key: '1 年',
          value: `${24 * 30 * 12}h`,
        },
        {
          key: '无过期时间',
          value: '0',
        },
      ],
      backupInProgress: false,
      featureLimited: false,
      showHTTPS: !window.ddExtension,
    };

    $scope.BACKUP_FORM_TYPES = { S3: 's3', FILE: 'file' };

    $scope.formValues = {
      customLogo: false,
      labelName: '',
      labelValue: '',
      enableTelemetry: false,
      passwordProtect: false,
      password: '',
      backupFormType: $scope.BACKUP_FORM_TYPES.FILE,
    };

    $scope.onToggleEnableTelemetry = function onToggleEnableTelemetry(checked) {
      $scope.$evalAsync(() => {
        $scope.formValues.enableTelemetry = checked;
      });
    };

    $scope.onToggleCustomLogo = function onToggleCustomLogo(checked) {
      $scope.$evalAsync(() => {
        $scope.formValues.customLogo = checked;
      });
    };

    $scope.onToggleAutoBackups = function onToggleAutoBackups(checked) {
      $scope.$evalAsync(() => {
        $scope.formValues.scheduleAutomaticBackups = checked;
      });
    };

    $scope.onBackupOptionsChange = function (type, limited) {
      $scope.formValues.backupFormType = type;
      $scope.state.featureLimited = limited;
    };

    $scope.removeFilteredContainerLabel = function (index) {
      var settings = $scope.settings;
      settings.BlackListedLabels.splice(index, 1);

      updateSettings(settings);
    };

    $scope.addFilteredContainerLabel = function () {
      var settings = $scope.settings;
      var label = {
        name: $scope.formValues.labelName,
        value: $scope.formValues.labelValue,
      };
      settings.BlackListedLabels.push(label);

      updateSettings(settings);
    };

    $scope.downloadBackup = function () {
      const payload = {};
      if ($scope.formValues.passwordProtect) {
        payload.password = $scope.formValues.password;
      }

      $scope.state.backupInProgress = true;

      BackupService.downloadBackup(payload)
        .then(function success(data) {
          const downloadData = new Blob([data.file], { type: 'application/gzip' });
          FileSaver.saveAs(downloadData, data.name);
          Notifications.success('Success', '备份成功下载');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法下载备份');
        })
        .finally(function final() {
          $scope.state.backupInProgress = false;
        });
    };

    $scope.saveApplicationSettings = function () {
      var settings = $scope.settings;

      if (!$scope.formValues.customLogo) {
        settings.LogoURL = '';
      }

      settings.EnableTelemetry = $scope.formValues.enableTelemetry;

      $scope.state.actionInProgress = true;
      updateSettings(settings);
    };

    function updateSettings(settings) {
      SettingsService.update(settings)
        .then(function success() {
          Notifications.success('Success', 'Settings updated');
          StateManager.updateLogo(settings.LogoURL);
          StateManager.updateSnapshotInterval(settings.SnapshotInterval);
          StateManager.updateEnableTelemetry(settings.EnableTelemetry);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新设置');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    }

    function initView() {
      const state = StateManager.getState();
      $scope.state.isDemo = state.application.demoEnvironment.enabled;

      SettingsService.settings()
        .then(function success(data) {
          var settings = data;
          $scope.settings = settings;

          if (settings.LogoURL !== '') {
            $scope.formValues.customLogo = true;
          }
          $scope.formValues.enableTelemetry = settings.EnableTelemetry;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });
    }

    initView();
  },
]);
