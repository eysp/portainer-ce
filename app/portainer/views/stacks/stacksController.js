angular.module('portainer.app').controller('StacksController', StacksController);

/* @ngInject */
function StacksController($scope, $state, Notifications, StackService, ModalService, EndpointProvider, Authentication, endpoint) {
  $scope.removeAction = function (selectedItems) {
    ModalService.confirmDeletion('您要删除选定的堆栈吗？ 相关服务也将被删除。', function onConfirm(confirmed) {
      if (!confirmed) {
        return;
      }
      deleteSelectedStacks(selectedItems);
    });
  };

  function deleteSelectedStacks(stacks) {
    var endpointId = EndpointProvider.endpointID();
    var actionCount = stacks.length;
    angular.forEach(stacks, function (stack) {
      StackService.remove(stack, stack.External, endpointId)
        .then(function success() {
          Notifications.success('堆栈成功删除', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除堆栈 ' + stack.Name);
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
    var endpointMode = $scope.applicationState.endpoint.mode;
    var endpointId = EndpointProvider.endpointID();

    const includeOrphanedStacks = Authentication.isAdmin();
    StackService.stacks(true, endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER', endpointId, includeOrphanedStacks)
      .then(function success(data) {
        var stacks = data;
        $scope.stacks = stacks;
        $scope.offlineMode = EndpointProvider.offlineMode();
      })
      .catch(function error(err) {
        $scope.stacks = [];
        Notifications.error('失败', err, '无法检索堆栈');
      });
  }

  async function loadCreateEnabled() {
    return endpoint.SecuritySettings.allowStackManagementForRegularUsers || Authentication.isAdmin();
  }

  async function initView() {
    getStacks();
    $scope.createEnabled = await loadCreateEnabled();
  }

  initView();
}
