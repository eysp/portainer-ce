import angular from 'angular';
import _ from 'lodash-es';

angular.module('portainer.app').controller('GroupsController', GroupsController);

function GroupsController($scope, $state, $async, GroupService, Notifications) {
  $scope.removeAction = removeAction;

  function removeAction(selectedItems) {
    return $async(removeActionAsync, selectedItems);
  }

  async function removeActionAsync(selectedItems) {
    for (let group of selectedItems) {
      try {
        await GroupService.deleteGroup(group.Id);

        Notifications.success('成功删除环境组', group.Name);
        _.remove($scope.groups, group);
      } catch (err) {
        Notifications.error('失败', err, '无法删除群组');
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
        Notifications.error('失败', err, '无法检索环境组');
        $scope.groups = [];
      });
  }

  initView();
}
