import angular from 'angular';
import _ from 'lodash-es';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

angular.module('portainer.app').controller('GroupsController', GroupsController);

function GroupsController($scope, $state, $async, GroupService, Notifications) {
  $scope.removeAction = removeAction;

  function removeAction(selectedItems) {
    return $async(removeActionAsync, selectedItems);
  }

  async function removeActionAsync(selectedItems) {
    const confirmed = await confirmDestructive({
      title: '您确定吗？',
      message: '您确定要删除选定的环境组吗？',
      confirmButton: buildConfirmButton('删除', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    for (let group of selectedItems) {
      try {
        await GroupService.deleteGroup(group.Id);

        Notifications.success('环境组已成功删除', group.Name);
        _.remove($scope.groups, group);
      } catch (err) {
        Notifications.error('失败', err, '无法删除分组');
      }
    }

    $state.reload();
  }

  function initView() {
    GroupService.groups()
      .then(function success(data) {
        $scope.groups = data;
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法获取环境分组');
        $scope.groups = [];
      });
  }

  initView();
}
