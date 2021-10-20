import angular from 'angular';
import _ from 'lodash-es';

angular.module('portainer.app').controller('TagsController', TagsController);

function TagsController($scope, $state, $async, TagService, Notifications) {
  $scope.state = {
    actionInProgress: false,
  };

  $scope.formValues = {
    Name: '',
  };

  $scope.checkNameValidity = function (form) {
    var valid = true;
    for (var i = 0; i < $scope.tags.length; i++) {
      if ($scope.formValues.Name === $scope.tags[i].Name) {
        valid = false;
        break;
      }
    }
    form.name.$setValidity('validName', valid);
  };

  $scope.removeAction = removeAction;

  function removeAction(tags) {
    return $async(removeActionAsync, tags);
  }

  async function removeActionAsync(tags) {
    for (let tag of tags) {
      try {
        await TagService.deleteTag(tag.Id);

        Notifications.success('标签已成功删除', tag.Name);
        _.remove($scope.tags, tag);
      } catch (err) {
        Notifications.error('失败', err, '无法删除标签');
      }
    }

    $state.reload();
  }

  $scope.createTag = function () {
    var tagName = $scope.formValues.Name;
    TagService.createTag(tagName)
      .then(function success() {
        Notifications.success('已成功创建标签', tagName);
        $state.reload();
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法创建标签');
      });
  };

  function initView() {
    TagService.tags()
      .then(function success(data) {
        $scope.tags = data;
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法检索标签');
        $scope.tags = [];
      });
  }

  initView();
}
