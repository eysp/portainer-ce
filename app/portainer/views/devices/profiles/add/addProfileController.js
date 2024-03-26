import angular from 'angular';
import { editor } from '@@/BoxSelector/common-options/build-methods';

import { createProfile } from 'Portainer/hostmanagement/fdo/fdo.service';

angular.module('portainer.app').controller('AddProfileController', AddProfileController);

/* @ngInject */
export default function AddProfileController($scope, $async, $state, $window, Notifications) {
  $scope.buildMethods = [editor];

  $scope.formValues = {
    name: '',
    profileFileContent: '',
  };

  $scope.state = {
    method: 'editor',
    actionInProgress: false,
    isEditorDirty: false,
  };

  $window.onbeforeunload = () => {
    if ($scope.state.method === 'editor' && $scope.formValues.profileFileContent && $scope.state.isEditorDirty) {
      return '';
    }
  };

  $scope.$on('$destroy', function () {
    $scope.state.isEditorDirty = false;
  });

  $scope.onChangeFormValues = onChangeFormValues;

  $scope.createProfileAsync = function () {
    return $async(async () => {
      const method = $scope.state.method;

      const name = $scope.formValues.name;
      const fileContent = $scope.formValues.profileFileContent;

      if (method !== 'editor' && fileContent === '') {
        $scope.state.formValidationError = '配置文件内容不能为空';
        return;
      }

      $scope.state.actionInProgress = true;

      try {
        await createProfile(name, method, fileContent);
        Notifications.success('成功', '配置文件创建成功');
        $scope.state.isEditorDirty = false;
        $state.go('portainer.settings.edgeCompute');
      } catch (err) {
        Notifications.error('失败', err, '无法创建配置文件');
      } finally {
        $scope.state.actionInProgress = false;
      }
    });
  };

  $scope.onChangeFileContent = function onChangeFileContent(value) {
    $scope.formValues.profileFileContent = value;
    $scope.state.isEditorDirty = true;
  };

  function onChangeFormValues(newValues) {
    $scope.formValues = newValues;
  }
}
