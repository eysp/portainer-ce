angular.module('portainer.docker').controller('ContainersDatatableActionsController', [
  '$state',
  'ContainerService',
  'ModalService',
  'Notifications',
  'HttpRequestHelper',
  function ($state, ContainerService, ModalService, Notifications, HttpRequestHelper) {
    this.startAction = function (selectedItems) {
      var successMessage = '容器已成功启动';
      var errorMessage = '无法启动容器';
      executeActionOnContainerList(selectedItems, ContainerService.startContainer, successMessage, errorMessage);
    };

    this.stopAction = function (selectedItems) {
      var successMessage = '容器已成功停止';
      var errorMessage = '无法停止容器r';
      executeActionOnContainerList(selectedItems, ContainerService.stopContainer, successMessage, errorMessage);
    };

    this.restartAction = function (selectedItems) {
      var successMessage = '容器已成功重新启动';
      var errorMessage = '无法重新启动容器';
      executeActionOnContainerList(selectedItems, ContainerService.restartContainer, successMessage, errorMessage);
    };

    this.killAction = function (selectedItems) {
      var successMessage = '成功终止容器';
      var errorMessage = '无法终止容器';
      executeActionOnContainerList(selectedItems, ContainerService.killContainer, successMessage, errorMessage);
    };

    this.pauseAction = function (selectedItems) {
      var successMessage = '容器已成功暂停';
      var errorMessage = '无法暂停容器';
      executeActionOnContainerList(selectedItems, ContainerService.pauseContainer, successMessage, errorMessage);
    };

    this.resumeAction = function (selectedItems) {
      var successMessage = '容器已成功恢复';
      var errorMessage = '无法恢复容器';
      executeActionOnContainerList(selectedItems, ContainerService.resumeContainer, successMessage, errorMessage);
    };

    this.removeAction = function (selectedItems) {
      var isOneContainerRunning = false;
      for (var i = 0; i < selectedItems.length; i++) {
        var container = selectedItems[i];
        if (container.State === 'running') {
          isOneContainerRunning = true;
          break;
        }
      }

      var title = '您将要删除一个或多个容器。';
      if (isOneContainerRunning) {
        title = '您将要删除一个或多个正在运行的容器。';
      }

      ModalService.confirmContainerDeletion(title, function (result) {
        if (!result) {
          return;
        }
        var cleanVolumes = false;
        if (result[0]) {
          cleanVolumes = true;
        }
        removeSelectedContainers(selectedItems, cleanVolumes);
      });
    };

    function executeActionOnContainerList(containers, action, successMessage, errorMessage) {
      var actionCount = containers.length;
      angular.forEach(containers, function (container) {
        HttpRequestHelper.setPortainerAgentTargetHeader(container.NodeName);
        action(container.Id)
          .then(function success() {
            Notifications.success(successMessage, container.Names[0]);
          })
          .catch(function error(err) {
            errorMessage = errorMessage + ':' + container.Names[0];
            Notifications.error('失败', err, errorMessage);
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function removeSelectedContainers(containers, cleanVolumes) {
      var actionCount = containers.length;
      angular.forEach(containers, function (container) {
        HttpRequestHelper.setPortainerAgentTargetHeader(container.NodeName);
        ContainerService.remove(container, cleanVolumes)
          .then(function success() {
            Notifications.success('容器成功删除', container.Names[0]);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除容器');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }
  },
]);
