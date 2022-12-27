import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { isOfflineEndpoint } from '@/portainer/helpers/endpointHelper';

angular.module('portainer.docker').controller('ImagesController', [
  '$scope',
  '$state',
  'Authentication',
  'ImageService',
  'Notifications',
  'ModalService',
  'HttpRequestHelper',
  'FileSaver',
  'Blob',
  'endpoint',
  function ($scope, $state, Authentication, ImageService, Notifications, ModalService, HttpRequestHelper, FileSaver, Blob, endpoint) {
    $scope.endpoint = endpoint;
    $scope.isAdmin = Authentication.isAdmin();

    $scope.state = {
      actionInProgress: false,
      exportInProgress: false,
      pullRateValid: false,
    };

    $scope.formValues = {
      RegistryModel: new PorImageRegistryModel(),
      NodeName: null,
    };

    $scope.pullImage = function () {
      const registryModel = $scope.formValues.RegistryModel;

      var nodeName = $scope.formValues.NodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);

      $scope.state.actionInProgress = true;
      ImageService.pullImage(registryModel, false)
        .then(function success(data) {
          var err = data[data.length - 1].errorDetail;
          if (err) {
            return Notifications.error('失败', err, '无法拉取镜像');
          }
          Notifications.success('已成功提取镜像', registryModel.Image);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法拉取镜像');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    $scope.confirmRemovalAction = function (selectedItems, force) {
      ModalService.confirmImageForceRemoval(function (confirmed) {
        if (!confirmed) {
          return;
        }
        $scope.removeAction(selectedItems, force);
      });
    };

    function isAuthorizedToDownload(selectedItems) {
      for (var i = 0; i < selectedItems.length; i++) {
        var image = selectedItems[i];

        var untagged = _.find(image.RepoTags, function (item) {
          return item.indexOf('<none>') > -1;
        });

        if (untagged) {
          Notifications.warning('', '无法下载未标记的镜像');
          return false;
        }
      }

      if (_.uniqBy(selectedItems, 'NodeName').length > 1) {
        Notifications.warning('', '不能同时从不同的节点下载镜像');
        return false;
      }

      return true;
    }

    function exportImages(images) {
      HttpRequestHelper.setPortainerAgentTargetHeader(images[0].NodeName);
      $scope.state.exportInProgress = true;
      ImageService.downloadImages(images)
        .then(function success(data) {
          var downloadData = new Blob([data.file], { type: 'application/x-tar' });
          FileSaver.saveAs(downloadData, 'images.tar');
          Notifications.success('成功', '已成功下载镜像');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法下载镜像');
        })
        .finally(function final() {
          $scope.state.exportInProgress = false;
        });
    }

    $scope.downloadAction = function (selectedItems) {
      if (!isAuthorizedToDownload(selectedItems)) {
        return;
      }

      ModalService.confirmImageExport(function (confirmed) {
        if (!confirmed) {
          return;
        }
        exportImages(selectedItems);
      });
    };

    $scope.removeAction = function (selectedItems, force) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (image) {
        HttpRequestHelper.setPortainerAgentTargetHeader(image.NodeName);
        ImageService.deleteImage(image.Id, force)
          .then(function success() {
            Notifications.success('已成功删除镜像', image.Id);
            var index = $scope.images.indexOf(image);
            $scope.images.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除镜像');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    };

    $scope.offlineMode = false;

    $scope.getImages = getImages;
    function getImages() {
      ImageService.images(true)
        .then(function success(data) {
          $scope.images = data;
          $scope.offlineMode = isOfflineEndpoint(endpoint);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索镜像');
          $scope.images = [];
        });
    }

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullRateValid = validity;
    }

    function initView() {
      getImages();
    }

    initView();
  },
]);
