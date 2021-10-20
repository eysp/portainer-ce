angular.module('portainer.app').controller('GroupController', function GroupController($q, $async, $scope, $state, $transition$, GroupService, TagService, Notifications) {
  $scope.state = {
    actionInProgress: false,
  };

  $scope.update = function () {
    var model = $scope.group;

    $scope.state.actionInProgress = true;
    GroupService.updateGroup(model)
      .then(function success() {
        Notifications.success('群组更新成功');
        $state.go('portainer.groups', {}, { reload: true });
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法更新群组');
      })
      .finally(function final() {
        $scope.state.actionInProgress = false;
      });
  };

  $scope.onCreateTag = function onCreateTag(tagName) {
    return $async(onCreateTagAsync, tagName);
  };

  async function onCreateTagAsync(tagName) {
    try {
      const tag = await TagService.createTag(tagName);
      $scope.availableTags = $scope.availableTags.concat(tag);
      $scope.group.TagIds = $scope.group.TagIds.concat(tag.Id);
    } catch (err) {
      Notifications.error('失败', err, '无法创建标签');
    }
  }

  function initView() {
    var groupId = $transition$.params().id;

    $q.all({
      group: GroupService.group(groupId),
      tags: TagService.tags(),
    })
      .then(function success(data) {
        $scope.group = data.group;
        $scope.availableTags = data.tags;
        $scope.loaded = true;
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法加载组详细信息');
      });
  }

  initView();
});
