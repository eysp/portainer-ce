import { confirmDelete } from '@@/modals/confirm';

import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.app').controller('StacksController', StacksController);

/* @ngInject */
function StacksController($scope, $state, Notifications, StackService, Authentication, endpoint) {
  $scope.removeAction = function (selectedItems) {
    confirmDelete('您要删除选中的堆栈吗？关联的服务也将被删除。').then((confirmed) => {
      if (!confirmed) {
        return;
      }
      deleteSelectedStacks(selectedItems);
    });
  };

  async function deleteSelectedStacks(selectedItems) {
    const endpointId = endpoint.Id;

    async function doRemove(stack) {
      return StackService.remove(stack, stack.External, endpointId)
        .then(function success() {
          Notifications.success('堆栈已成功删除', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除堆栈 ' + stack.Name);
        });
    }

    await processItemsInBatches(selectedItems, doRemove);
    $state.reload();
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
        Notifications.error('失败', err, '无法获取堆栈');
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
