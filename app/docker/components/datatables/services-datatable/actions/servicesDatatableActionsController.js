angular.module('portainer.docker').controller('ServicesDatatableActionsController', [
  '$q',
  '$state',
  'ServiceService',
  'ServiceHelper',
  'Notifications',
  'ModalService',
  'ImageHelper',
  'WebhookService',
  'EndpointProvider',
  function ($q, $state, ServiceService, ServiceHelper, Notifications, ModalService, ImageHelper, WebhookService, EndpointProvider) {
    this.scaleAction = function scaleService(service) {
      var config = ServiceHelper.serviceToConfig(service.Model);
      config.Mode.Replicated.Replicas = service.Replicas;
      ServiceService.update(service, config)
        .then(function success() {
          Notifications.success('服务已成功扩展', '新副本数: ' + service.Replicas);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法扩展服务');
          service.Scale = false;
          service.Replicas = service.ReplicaCount;
        });
    };

    this.removeAction = function (selectedItems) {
      ModalService.confirmDeletion(
        '您要删除选定的服务吗？ 与所选服务关联的所有容器也将被删除。',
        function onConfirm(confirmed) {
          if (!confirmed) {
            return;
          }
          removeServices(selectedItems);
        }
      );
    };

    this.updateAction = function (selectedItems) {
      ModalService.confirmServiceForceUpdate(
        '是否要强制更新所选服务？ 将重新创建与所选服务关联的所有任务。',
        function (result) {
          if (!result) {
            return;
          }
          var pullImage = false;
          if (result[0]) {
            pullImage = true;
          }
          forceUpdateServices(selectedItems, pullImage);
        }
      );
    };

    function forceUpdateServices(services, pullImage) {
      var actionCount = services.length;
      angular.forEach(services, function (service) {
        var config = ServiceHelper.serviceToConfig(service.Model);
        if (pullImage) {
          config.TaskTemplate.ContainerSpec.Image = ImageHelper.removeDigestFromRepository(config.TaskTemplate.ContainerSpec.Image);
        }

        // As explained in https://github.com/docker/swarmkit/issues/2364 ForceUpdate can accept a random
        // value or an increment of the counter value to force an update.
        config.TaskTemplate.ForceUpdate++;
        ServiceService.update(service, config)
          .then(function success() {
            Notifications.success('服务更新成功', service.Name);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法强制更新服务', service.Name);
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function removeServices(services) {
      var actionCount = services.length;
      angular.forEach(services, function (service) {
        ServiceService.remove(service)
          .then(function success() {
            return WebhookService.webhooks(service.Id, EndpointProvider.endpointID());
          })
          .then(function success(data) {
            return $q.when(data.length !== 0 && WebhookService.deleteWebhook(data[0].Id));
          })
          .then(function success() {
            Notifications.success('服务已成功删除', service.Name);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除服务');
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
