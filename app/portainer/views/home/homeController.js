import EndpointHelper from 'Portainer/helpers/endpointHelper';

angular
  .module('portainer.app')
  .controller('HomeController', function (
    $q,
    $scope,
    $state,
    TagService,
    Authentication,
    EndpointService,
    GroupService,
    Notifications,
    EndpointProvider,
    StateManager,
    ModalService,
    MotdService
  ) {
    $scope.state = {
      connectingToEdgeEndpoint: false,
      homepageLoadTime: '',
    };

    $scope.goToEdit = function (id) {
      $state.go('portainer.endpoints.endpoint', { id: id });
    };

    $scope.goToDashboard = function (endpoint) {
      if (endpoint.Type === 3) {
        $state.go('azure.dashboard', { endpointId: endpoint.Id });
        return;
      }
      if (endpoint.Type === 4 || endpoint.Type === 7) {
        if (!endpoint.EdgeID) {
          $state.go('portainer.endpoints.endpoint', { id: endpoint.Id });
          return;
        }
        $scope.state.connectingToEdgeEndpoint = true;
      }
      if (endpoint.Type === 5 || endpoint.Type === 6 || endpoint.Type === 7) {
        $state.go('kubernetes.dashboard', { endpointId: endpoint.Id });
        return;
      }
      $state.go('docker.dashboard', { endpointId: endpoint.Id });
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

    function triggerSnapshot() {
      EndpointService.snapshotEndpoints()
        .then(function success() {
          Notifications.success('成功', 'Environments updated');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '环境快照期间发生错误');
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
          Notifications.error('失败', err, '无法检索环境信息');
        });
      return deferred.promise;
    }

    async function initView() {
      $scope.state.homepageLoadTime = Math.floor(Date.now() / 1000);
      $scope.isAdmin = Authentication.isAdmin();

      MotdService.motd().then(function success(data) {
        $scope.motd = data;
      });

      try {
        const [{ totalCount, endpoints }, tags] = await Promise.all([getPaginatedEndpoints(0, 100), TagService.tags()]);
        $scope.tags = tags;

        $scope.totalCount = totalCount;
        if (totalCount > 100) {
          $scope.endpoints = [];
        } else {
          $scope.endpoints = endpoints;
        }
      } catch (err) {
        Notifications.error('加载页面数据失败', err);
      }
    }

    initView();
  });
