import { EndpointGroupDefaultModel } from '../../../models/group';

angular.module('portainer.app').controller('CreateGroupController', function CreateGroupController($async, $scope, $state, GroupService, TagService, Notifications) {
  $scope.state = {
    actionInProgress: false,
  };

  $scope.create = function () {
    var model = $scope.model;

    var associatedEndpoints = [];
    for (var i = 0; i < $scope.associatedEndpoints.length; i++) {
      var endpoint = $scope.associatedEndpoints[i];
      associatedEndpoints.push(endpoint.Id);
    }

    $scope.state.actionInProgress = true;
    GroupService.createGroup(model, associatedEndpoints)
      .then(function success() {
        Notifications.success('组已成功创建');
        $state.go('portainer.groups', {}, { reload: true });
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法创建组');
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
      $scope.model.TagIds = $scope.model.TagIds.concat(tag.Id);
    } catch (err) {
      Notifications.error('Failue', err, '无法创建标签');
    }
  }

  function initView() {
    TagService.tags()
      .then((tags) => {
        $scope.availableTags = tags;
        $scope.associatedEndpoints = [];
        $scope.model = new EndpointGroupDefaultModel();
        $scope.loaded = true;
      })
      .catch((err) => {
        Notifications.error('失败', err, '无法检索标签');
      });
  }

  initView();
});
