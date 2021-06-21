angular
  .module('portainer.app')
  .controller('HomeController', function (
    $q,
    $scope,
    $state,
    TagService,
    Authentication,
    EndpointService,
    EndpointHelper,
    GroupService,
    Notifications,
    EndpointProvider,
    StateManager,
    LegacyExtensionManager,
    ModalService,
    MotdService,
    SystemService
  ) {
    $scope.state = {
      connectingToEdgeEndpoint: false,
    };

    $scope.goToEdit = function (id) {
      $state.go('portainer.endpoints.endpoint', { id: id });
    };

    $scope.goToDashboard = function (endpoint) {
      if (endpoint.Type === 3) {
        return switchToAzureEndpoint(endpoint);
      } else if (endpoint.Type === 4) {
        return switchToEdgeEndpoint(endpoint);
      }

      checkEndpointStatus(endpoint)
        .then(function success(data) {
          endpoint = data;
          return switchToDockerEndpoint(endpoint);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法验证端点状态');
        });
    };

    $scope.dismissImportantInformation = function (hash) {
      StateManager.dismissImportantInformation(hash);
    };

    $scope.dismissInformationPanel = function (id) {
      StateManager.dismissInformationPanel(id);
    };

    $scope.triggerSnapshot = function () {
      ModalService.confirmEndpointSnapshot(function (result) {
        if (!result) {
          return;
        }
        triggerSnapshot();
      });
    };

    function checkEndpointStatus(endpoint) {
      var deferred = $q.defer();

      var status = 1;
      SystemService.ping(endpoint.Id)
        .then(function success() {
          status = 1;
        })
        .catch(function error() {
          status = 2;
        })
        .finally(function () {
          if (endpoint.Status === status) {
            deferred.resolve(endpoint);
            return deferred.promise;
          }

          EndpointService.updateEndpoint(endpoint.Id, { Status: status })
            .then(function success() {
              endpoint.Status = status;
              deferred.resolve(endpoint);
            })
            .catch(function error(err) {
              deferred.reject({ msg: '无法更新端点状态', err: err });
            });
        });

      return deferred.promise;
    }

    function switchToAzureEndpoint(endpoint) {
      EndpointProvider.setEndpointID(endpoint.Id);
      EndpointProvider.setEndpointPublicURL(endpoint.PublicURL);
      EndpointProvider.setOfflineModeFromStatus(endpoint.Status);
      StateManager.updateEndpointState(endpoint, [])
        .then(function success() {
          $state.go('azure.dashboard');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法连接到 Azure 端点');
        });
    }

    function switchToEdgeEndpoint(endpoint) {
      if (!endpoint.EdgeID) {
        $state.go('portainer.endpoints.endpoint', { id: endpoint.Id });
        return;
      }

      $scope.state.connectingToEdgeEndpoint = true;
      SystemService.ping(endpoint.Id)
        .then(function success() {
          endpoint.Status = 1;
        })
        .catch(function error() {
          endpoint.Status = 2;
        })
        .finally(function final() {
          switchToDockerEndpoint(endpoint);
        });
    }

    function switchToDockerEndpoint(endpoint) {
      if (endpoint.Status === 2 && endpoint.Snapshots[0] && endpoint.Snapshots[0].Swarm === true) {
        $scope.state.connectingToEdgeEndpoint = false;
        Notifications.error('失败', '', '端点无法访问。 连接到另一个群管理器。');
        return;
      } else if (endpoint.Status === 2 && !endpoint.Snapshots[0]) {
        $scope.state.connectingToEdgeEndpoint = false;
        Notifications.error('失败', '', '端点无法访问，并且没有可用于离线浏览的快照。');
        return;
      }

      EndpointProvider.setEndpointID(endpoint.Id);
      EndpointProvider.setEndpointPublicURL(endpoint.PublicURL);
      EndpointProvider.setOfflineModeFromStatus(endpoint.Status);
      LegacyExtensionManager.initEndpointExtensions(endpoint)
        .then(function success(data) {
          var extensions = data;
          return StateManager.updateEndpointState(endpoint, extensions);
        })
        .then(function success() {
          $state.go('docker.dashboard');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法连接到 Docker 端点');
          $state.reload();
        })
        .finally(function final() {
          $scope.state.connectingToEdgeEndpoint = false;
        });
    }

    function triggerSnapshot() {
      EndpointService.snapshotEndpoints()
        .then(function success() {
          Notifications.success('成功', '端点已更新');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '端点快照期间发生错误');
        });
    }

    $scope.getPaginatedEndpoints = getPaginatedEndpoints;
    function getPaginatedEndpoints(lastId, limit, search) {
      const deferred = $q.defer();
      $q.all({
        endpoints: EndpointService.endpoints(lastId, limit, { search }),
        groups: GroupService.groups(),
      })
        .then(function success(data) {
          var endpoints = data.endpoints.value;
          var groups = data.groups;
          EndpointHelper.mapGroupNameToEndpoint(endpoints, groups);
          EndpointProvider.setEndpoints(endpoints);
          deferred.resolve({ endpoints: endpoints, totalCount: data.endpoints.totalCount });
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索端点信息');
        });
      return deferred.promise;
    }

    async function initView() {
      $scope.isAdmin = Authentication.isAdmin();

      MotdService.motd().then(function success(data) {
        $scope.motd = data;
      });

      getPaginatedEndpoints(0, 100).then((data) => {
        const totalCount = data.totalCount;
        $scope.totalCount = totalCount;
        if (totalCount > 100) {
          $scope.endpoints = [];
        } else {
          $scope.endpoints = data.endpoints;
        }
      });

      try {
        $scope.tags = await TagService.tags();
      } catch (e) {
        Notifications.error('加载标签失败', e);
      }
    }

    initView();
  });
