import uuidv4 from 'uuid/v4';

import { PortainerEndpointCreationTypes } from 'Portainer/models/endpoint/models';
import { configureDevice, getProfiles } from 'Portainer/hostmanagement/fdo/fdo.service';

angular
  .module('portainer.app')
  .controller(
    'ImportDeviceController',
    function ImportDeviceController($async, $q, $scope, $state, EndpointService, GroupService, TagService, Notifications, Authentication, FileUploadService) {
      $scope.state = {
        actionInProgress: false,
        vouchersUploading: false,
        vouchersUploaded: false,
        deviceIDs: [],
        allowCreateTag: Authentication.isAdmin(),
      };

      $scope.formValues = {
        DeviceName: '',
        DeviceProfile: '',
        GroupId: 1,
        TagIds: [],
        VoucherFiles: [],
        PortainerURL: '',
        Suffix: 1,
      };

      $scope.profiles = [];

      $scope.onChangeTags = function onChangeTags(value) {
        return $scope.$evalAsync(() => {
          $scope.formValues.TagIds = value;
        });
      };

      $scope.onVoucherFilesChange = function () {
        if ($scope.formValues.VoucherFiles.length < 1) {
          return;
        }

        $scope.state.vouchersUploading = true;

        let uploads = $scope.formValues.VoucherFiles.map((f) => FileUploadService.uploadOwnershipVoucher(f));

        $q.all(uploads)
          .then(function success(responses) {
            $scope.state.vouchersUploading = false;
            $scope.state.vouchersUploaded = true;
            $scope.state.deviceIDs = responses.map((r) => r.data.guid);
          })
          .catch(function error(err) {
            $scope.state.vouchersUploading = false;
            if ($scope.formValues.VoucherFiles.length === 1) {
              Notifications.error('失败', err, '无法上传所有权凭证');
            } else {
              Notifications.error('失败', null, '无法上传所有权凭证，请检查日志');
            }
          });
      };

      $scope.createEndpointAndConfigureDevice = function () {
        return $async(async () => {
          $scope.state.actionInProgress = true;

          let suffix = $scope.formValues.Suffix;

          for (const deviceID of $scope.state.deviceIDs) {
            let deviceName = $scope.formValues.DeviceName + suffix;

            try {
              var endpoint = await EndpointService.createRemoteEndpoint(
                deviceName,
                PortainerEndpointCreationTypes.EdgeAgentEnvironment,
                $scope.formValues.PortainerURL,
                '',
                $scope.formValues.GroupId,
                $scope.formValues.TagIds,
                false,
                false,
                false,
                null,
                null,
                null,
                null
              );
            } catch (err) {
              Notifications.error('失败', err, '无法创建环境');
              $scope.state.actionInProgress = false;
              return;
            }

            suffix++;

            const config = {
              edgeID: endpoint.EdgeID || uuidv4(),
              edgeKey: endpoint.EdgeKey,
              name: deviceName,
              profile: $scope.formValues.DeviceProfile,
            };

            try {
              await configureDevice(deviceID, config);
            } catch (err) {
              Notifications.error('失败', err, '无法导入设备');
              return;
            } finally {
              $scope.state.actionInProgress = false;
            }
          }

          Notifications.success('成功', '设备成功导入');
          $state.go('edge.devices');
        });
      };

      async function initView() {
        try {
          $scope.profiles = await getProfiles();
        } catch (err) {
          Notifications.error('失败', err, '无法加载配置文件');
          return;
        }

        $q.all({
          groups: GroupService.groups(),
        })
          .then(function success(data) {
            $scope.groups = data.groups;
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法加载分组');
          });
      }

      initView();
    }
  );
