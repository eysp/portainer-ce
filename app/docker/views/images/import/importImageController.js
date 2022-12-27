import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';

angular.module('portainer.docker').controller('ImportImageController', [
  '$scope',
  '$state',
  'ImageService',
  'Notifications',
  'HttpRequestHelper',
  'Authentication',
  'ImageHelper',
  'endpoint',
  function ($scope, $state, ImageService, Notifications, HttpRequestHelper, Authentication, ImageHelper, endpoint) {
    $scope.state = {
      actionInProgress: false,
    };

    $scope.endpoint = endpoint;

    $scope.isAdmin = Authentication.isAdmin();

    $scope.formValues = {
      UploadFile: null,
      NodeName: null,
      RegistryModel: new PorImageRegistryModel(),
    };

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullImageValidity = validity;
    }

    async function tagImage(id) {
      const registryModel = $scope.formValues.RegistryModel;
      if (registryModel.Image) {
        const image = ImageHelper.createImageConfigForContainer(registryModel);
        try {
          await ImageService.tagImage(id, image.fromImage);
        } catch (err) {
          Notifications.error('失败', err, '无法标记镜像');
        }
      }
    }

    $scope.uploadImage = async function () {
      $scope.state.actionInProgress = true;

      var nodeName = $scope.formValues.NodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);
      var file = $scope.formValues.UploadFile;
      try {
        const { data } = await ImageService.uploadImage(file);
        if (data.error) {
          Notifications.error('失败', data.error, '无法上传镜像');
        } else if (data.stream) {
          var regex = /Loaded.*?: (.*?)\n$/g;
          var imageIds = regex.exec(data.stream);
          if (imageIds && imageIds.length == 2) {
            await tagImage(imageIds[1]);
            $state.go('docker.images.image', { id: imageIds[1] }, { reload: true });
          }
          Notifications.success('成功', '镜像成功上传');
        } else {
          Notifications.success('成功', '上传的tar文件包含多个镜像。因此，提供的标记已被忽略。');
        }
      } catch (err) {
        Notifications.error('失败', err, '无法上传镜像');
      } finally {
        $scope.state.actionInProgress = false;
      }
    };
  },
]);
