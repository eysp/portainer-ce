import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { confirmImageExport } from '@/react/docker/images/common/ConfirmExportModal';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';
import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.docker').controller('ImagesController', [
  '$scope',
  '$state',
  'Authentication',
  'ImageService',
  'Notifications',
  'HttpRequestHelper',
  'FileSaver',
  'Blob',
  'endpoint',
  '$async',
  function ($scope, $state, Authentication, ImageService, Notifications, HttpRequestHelper, FileSaver, Blob, endpoint) {
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

      $scope.state.actionInProgress = true;
      ImageService.pullImage(registryModel, nodeName)
        .then(function success() {
          Notifications.success('镜像拉取成功', registryModel.Image);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法拉取镜像');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    function confirmImageForceRemoval() {
      return confirmDestructive({
        title: '您确定吗？',
        message:
          "强制删除镜像将会移除它，即使它被停止的容器使用，并删除所有相关的标签。您确定要删除选中的镜像吗？",
        confirmButton: buildConfirmButton('删除镜像', 'danger'),
      });
    }

    function confirmRegularRemove() {
      return confirmDestructive({
        title: '您确定吗？',
        message: '删除镜像将同时删除所有相关的标签。您确定要删除选中的镜像吗？',
        confirmButton: buildConfirmButton('删除镜像', 'danger'),
      });
    }

    /**
     *
     * @param {Array<import('@/react/docker/images/queries/useImages').ImagesListResponse>} selectedItems
     * @param {boolean} force
     */
    $scope.confirmRemovalAction = async function (selectedItems, force) {
      const confirmed = await (force ? confirmImageForceRemoval() : confirmRegularRemove());

      if (!confirmed) {
        return;
      }

      $scope.removeAction(selectedItems, force);
    };

    /**
     *
     * @param {Array<import('@/react/docker/images/queries/useImages').ImagesListResponse>} selectedItems
     */
    function isAuthorizedToDownload(selectedItems) {
      for (var i = 0; i < selectedItems.length; i++) {
        var image = selectedItems[i];

        var untagged = _.find(image.tags, function (item) {
          return item.indexOf('<none>') > -1;
        });

        if (untagged) {
          Notifications.warning('', '法下载未标记的镜像');
          return false;
        }
      }

      if (_.uniqBy(selectedItems, 'NodeName').length > 1) {
        Notifications.warning('', '无法同时从不同节点下载镜像');
        return false;
      }

      return true;
    }

    /**
     *
     * @param {Array<import('@/react/docker/images/queries/useImages').ImagesListResponse>} images
     */
    function exportImages(images) {
      HttpRequestHelper.setPortainerAgentTargetHeader(images[0].nodeName);
      $scope.state.exportInProgress = true;
      ImageService.downloadImages(images)
        .then(function success(data) {
          var downloadData = new Blob([data], { type: 'application/x-tar' });
          FileSaver.saveAs(downloadData, 'images.tar');
          Notifications.success('成功', '镜像已成功下载');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法下载镜像');
        })
        .finally(function final() {
          $scope.state.exportInProgress = false;
        });
    }

    /**
     *
     * @param {Array<import('@/react/docker/images/queries/useImages').ImagesListResponse>} selectedItems
     */
    $scope.downloadAction = function (selectedItems) {
      if (!isAuthorizedToDownload(selectedItems)) {
        return;
      }

      confirmImageExport(function (confirmed) {
        if (!confirmed) {
          return;
        }
        exportImages(selectedItems);
      });
    };

    $scope.removeAction = removeAction;

    /**
     *
     * @param {Array<import('@/react/docker/images/queries/useImages').ImagesListResponse>} selectedItems
     * @param {boolean} force
     */
    async function removeAction(selectedItems, force) {
      async function doRemove(image) {
        HttpRequestHelper.setPortainerAgentTargetHeader(image.nodeName);
        return ImageService.deleteImage(image.id, force)
          .then(function success() {
            Notifications.success('镜像已成功删除', image.id);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除镜像');
          });
      }

      await processItemsInBatches(selectedItems, doRemove);
      $state.reload();
    }

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullRateValid = validity;
    }
  },
]);
