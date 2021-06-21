import angular from 'angular';

angular.module('portainer.app').controller('EndpointsController', EndpointsController);

function EndpointsController($q, $scope, $state, $async, EndpointService, GroupService, EndpointHelper, Notifications) {
  $scope.removeAction = removeAction;

  function removeAction(endpoints) {
    return $async(removeActionAsync, endpoints);
  }

  async function removeActionAsync(endpoints) {
    for (let endpoint of endpoints) {
      try {
        await EndpointService.deleteEndpoint(endpoint.Id);

        Notifications.success('端点成功删除', endpoint.Name);
      } catch (err) {
        Notifications.error('失败', err, '无法删除端点');
      }
    }

    $state.reload();
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
        deferred.resolve({ endpoints: endpoints, totalCount: data.endpoints.totalCount });
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法检索端点信息');
      });
    return deferred.promise;
  }
}
