import _ from 'lodash-es';

angular.module('portainer.app').controller('RegistriesController', [
  '$q',
  '$scope',
  '$state',
  'RegistryService',
  'DockerHubService',
  'ModalService',
  'Notifications',
  'ExtensionService',
  'Authentication',
  function ($q, $scope, $state, RegistryService, DockerHubService, ModalService, Notifications, ExtensionService, Authentication) {
    $scope.state = {
      actionInProgress: false,
    };

    $scope.formValues = {
      dockerHubPassword: '',
    };

    const nonBrowsableUrls = ['quay.io'];

    $scope.canBrowse = function (item) {
      return !_.includes(nonBrowsableUrls, item.URL);
    };

    $scope.updateDockerHub = function () {
      var dockerhub = $scope.dockerhub;
      dockerhub.Password = $scope.formValues.dockerHubPassword;
      $scope.state.actionInProgress = true;
      DockerHubService.update(dockerhub)
        .then(function success() {
          Notifications.success('DockerHub 注册表已更新');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法更新 DockerHub 详细信息');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    $scope.removeAction = function (selectedItems) {
      ModalService.confirmDeletion('是否要删除选定的注册表？', function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        deleteSelectedRegistries(selectedItems);
      });
    };

    function deleteSelectedRegistries(selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (registry) {
        RegistryService.deleteRegistry(registry.Id)
          .then(function success() {
            Notifications.success('注册表已成功删除', registry.Name);
            var index = $scope.registries.indexOf(registry);
            $scope.registries.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除注册表');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function initView() {
      $q.all({
        registries: RegistryService.registries(),
        dockerhub: DockerHubService.dockerhub(),
        registryManagement: ExtensionService.extensionEnabled(ExtensionService.EXTENSIONS.REGISTRY_MANAGEMENT),
      })
        .then(function success(data) {
          $scope.registries = data.registries;
          $scope.dockerhub = data.dockerhub;
          $scope.registryManagementAvailable = data.registryManagement;
          var authenticationEnabled = $scope.applicationState.application.authentication;
          if (authenticationEnabled) {
            $scope.isAdmin = Authentication.isAdmin();
          }
        })
        .catch(function error(err) {
          $scope.registries = [];
          Notifications.error('失败', err, '无法检索注册表');
        });
    }

    initView();
  },
]);
