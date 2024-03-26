import { confirmDelete } from '@@/modals/confirm';

angular.module('portainer.app').controller('StacksController', StacksController);

/* @ngInject */
function StacksController($scope, $state, Notifications, StackService, Authentication, endpoint) {
  $scope.removeAction = function (selectedItems) {
    confirmDelete('您要删除选定的堆栈吗？关联的服务也将被删除。').then((confirmed) => {
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
          Notifications.success('堆栈已成功删除', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('删除失败', err, '无法删除堆栈 ' + stack.Name);
        })
        .finally(function final() {
          --actionCount;
          if (actionCount === 0) {
            $state.reload();
          }
        });
    });
  }

  $scope.createEnabled = false;

  $scope.getStacks = getStacks;

  function getStacks() {
    const endpointMode = $scope.applicationState.endpoint.mode;
    const endpointId = endpoint.Id;

    const includeOrphanedStacks = Authentication.isAdmin();
    StackService.stacks(true, endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER', endpointId, includeOrphanedStacks)
      .then(function success(stacks) {
        $scope.stacks = stacks;
      })
      .catch(function error(err) {
        $scope.stacks = [];
        Notifications.error('失败', err, '无法检索堆栈');
      });
  }

  async function canManageStacks() {
    return endpoint.SecuritySettings.allowStackManagementForRegularUsers || Authentication.isAdmin();
  }

  async function initView() {
    // 如果用户不是管理员，并且非管理员禁用了堆栈管理，则将用户导航到仪表板
    $scope.createEnabled = await canManageStacks();
    if (!$scope.createEnabled) {
      $state.go('docker.dashboard');
    }
    getStacks();
  }

  initView();
}
