import { isOfflineEndpoint } from '@/portainer/helpers/endpointHelper';

angular.module('portainer.app').controller('StacksController', StacksController);

/* @ngInject */
function StacksController($scope, $state, Notifications, StackService, ModalService, Authentication, endpoint) {
  $scope.removeAction = function (selectedItems) {
    ModalService.confirmDeletion('你想删除选定的堆栈吗？相关的服务也将被删除。', function onConfirm(confirmed) {
      if (!confirmed) {
        return;
      }
      deleteSelectedStacks(selectedItems);
    });
  };

  function deleteSelectedStacks(stacks) {
    const endpointId = endpoint.Id;
    let actionCount = stacks.length;
    angular.forEach(stacks, function (stack) {
      StackService.remove(stack, stack.External, endpointId)
        .then(function success() {
          Notifications.success('堆栈成功删除', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, 'Unable to remove stack ' + stack.Name);
        })
        .finally(function final() {
          --actionCount;
          if (actionCount === 0) {
            $state.reload();
          }
        });
    });
  }

  $scope.offlineMode = false;
  $scope.createEnabled = false;

  $scope.getStacks = getStacks;

  function getStacks() {
    const endpointMode = $scope.applicationState.endpoint.mode;
    const endpointId = endpoint.Id;

    const includeOrphanedStacks = Authentication.isAdmin();
    StackService.stacks(true, endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER', endpointId, includeOrphanedStacks)
      .then(function success(stacks) {
        $scope.stacks = stacks;
        $scope.offlineMode = isOfflineEndpoint(endpoint);
      })
      .catch(function error(err) {
        $scope.stacks = [];
        Notifications.error('失败', err, 'Unable to retrieve stacks');
      });
  }

  async function canManageStacks() {
    return endpoint.SecuritySettings.allowStackManagementForRegularUsers || Authentication.isAdmin();
  }

  async function initView() {
    // if the user is not an admin, and stack management is disabled for non admins, then take the user to the dashboard
    $scope.createEnabled = await canManageStacks();
    if (!$scope.createEnabled) {
      $state.go('docker.dashboard');
    }
    getStacks();
  }

  initView();
}
