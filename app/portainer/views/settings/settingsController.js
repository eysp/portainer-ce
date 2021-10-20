import angular from 'angular';

import { buildOption } from '@/portainer/components/box-selector';
import { S3_BACKUP_SETTING } from '@/portainer/feature-flags/feature-ids';

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
    $scope.s3BackupFeatureId = S3_BACKUP_SETTING;
    $scope.backupOptions = [
      buildOption('backup_file', 'fa fa-download', '下载备份文件', '', 'file'),
      buildOption('backup_s3', 'fa fa-upload', 'Store in S3', '定义cron计划', 's3', S3_BACKUP_SETTING),
    ];

    $scope.state = {
      actionInProgress: false,
      availableEdgeAgentCheckinOptions: [
        {
          key: '5 秒',
          value: 5,
        },
        {
          key: '10 秒',
          value: 10,
        },
        {
          key: '30 秒',
          value: 30,
        },
      ],
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
          key: '不过期',
          value: '0',
        },
      ],
      backupInProgress: false,
      featureLimited: false,
    };

    $scope.BACKUP_FORM_TYPES = { S3: 's3', FILE: 'file' };

    $scope.formValues = {
      customLogo: false,
      labelName: '',
      labelValue: '',
      enableEdgeComputeFeatures: false,
      enableTelemetry: false,
      passwordProtect: false,
      password: '',
      backupFormType: $scope.BACKUP_FORM_TYPES.FILE,
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
          Notifications.success('备份已成功下载');
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

      settings.EnableEdgeComputeFeatures = $scope.formValues.enableEdgeComputeFeatures;
      settings.EnableTelemetry = $scope.formValues.enableTelemetry;

      $scope.state.actionInProgress = true;
      updateSettings(settings);
    };

    function updateSettings(settings) {
      SettingsService.update(settings)
        .then(function success() {
          Notifications.success('Settings updated');
          StateManager.updateLogo(settings.LogoURL);
          StateManager.updateSnapshotInterval(settings.SnapshotInterval);
          StateManager.updateEnableEdgeComputeFeatures(settings.EnableEdgeComputeFeatures);
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
      SettingsService.settings()
        .then(function success(data) {
          var settings = data;
          $scope.settings = settings;

          if (settings.LogoURL !== '') {
            $scope.formValues.customLogo = true;
          }
          $scope.formValues.enableEdgeComputeFeatures = settings.EnableEdgeComputeFeatures;
          $scope.formValues.enableTelemetry = settings.EnableTelemetry;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });
    }

    initView();
  },
]);
