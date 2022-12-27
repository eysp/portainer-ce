angular.module('portainer.docker').controller('BuildImageController', BuildImageController);

/* @ngInject */
function BuildImageController($scope, $async, $window, ModalService, BuildService, Notifications, HttpRequestHelper) {
  $scope.state = {
    BuildType: 'editor',
    actionInProgress: false,
    activeTab: 0,
    isEditorDirty: false,
  };

  $scope.formValues = {
    ImageNames: [{ Name: '', Valid: false, Unique: true }],
    UploadFile: null,
    DockerFileContent: '',
    AdditionalFiles: [],
    URL: '',
    Path: 'Dockerfile',
    NodeName: null,
  };

  $window.onbeforeunload = () => {
    if ($scope.state.BuildType === 'editor' && $scope.formValues.DockerFileContent && $scope.state.isEditorDirty) {
      return '';
    }
  };

  $scope.$on('$destroy', function () {
    $scope.state.isEditorDirty = false;
  });

  $scope.checkName = function (index) {
    var item = $scope.formValues.ImageNames[index];
    item.Valid = true;
    item.Unique = true;
    if (item.Name !== '') {
      // Check unique
      $scope.formValues.ImageNames.forEach((element, idx) => {
        if (idx != index && element.Name == item.Name) {
          item.Valid = false;
          item.Unique = false;
        }
      });
      if (!item.Valid) {
        return;
      }
    }
    // Validation
    const parts = item.Name.split('/');
    const repository = parts[parts.length - 1];
    const repositoryRegExp = RegExp('^[a-z0-9-_]{2,255}(:[A-Za-z0-9-_.]{1,128})?$');
    item.Valid = repositoryRegExp.test(repository);
  };

  $scope.addImageName = function () {
    $scope.formValues.ImageNames.push({ Name: '', Valid: false, Unique: true });
  };

  $scope.removeImageName = function (index) {
    $scope.formValues.ImageNames.splice(index, 1);
    for (var i = 0; i < $scope.formValues.ImageNames.length; i++) {
      $scope.checkName(i);
    }
  };

  function buildImageBasedOnBuildType(method, names) {
    var buildType = $scope.state.BuildType;
    var dockerfilePath = $scope.formValues.Path;

    if (buildType === 'upload') {
      var file = $scope.formValues.UploadFile;
      return BuildService.buildImageFromUpload(names, file, dockerfilePath);
    } else if (buildType === 'url') {
      var URL = $scope.formValues.URL;
      return BuildService.buildImageFromURL(names, URL, dockerfilePath);
    } else {
      var dockerfileContent = $scope.formValues.DockerFileContent;
      if ($scope.formValues.AdditionalFiles.length === 0) {
        return BuildService.buildImageFromDockerfileContent(names, dockerfileContent);
      } else {
        var additionalFiles = $scope.formValues.AdditionalFiles;
        return BuildService.buildImageFromDockerfileContentAndFiles(names, dockerfileContent, additionalFiles);
      }
    }
  }

  $scope.buildImage = buildImage;

  async function buildImage() {
    return $async(async () => {
      var buildType = $scope.state.BuildType;

      if (buildType === 'editor' && $scope.formValues.DockerFileContent === '') {
        $scope.state.formValidationError = 'Dockerfile内容不能为空';
        return;
      }

      $scope.state.actionInProgress = true;

      var imageNames = $scope.formValues.ImageNames.filter(function filterNull(x) {
        return x.Name;
      }).map(function getNames(x) {
        return x.Name;
      });

      var nodeName = $scope.formValues.NodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);

      try {
        const data = await buildImageBasedOnBuildType(buildType, imageNames);
        $scope.buildLogs = data.buildLogs;
        $scope.state.activeTab = 1;
        if (data.hasError) {
          Notifications.error('在构建过程中发生了一个错误', { msg: '请检查构建日志输出' });
        } else {
          Notifications.success('已成功构建镜像');
          $scope.state.isEditorDirty = false;
        }
      } catch (err) {
        Notifications.error('失败', err, '无法构建镜像');
      } finally {
        $scope.state.actionInProgress = false;
      }
    });
  }

  $scope.validImageNames = function () {
    if ($scope.formValues.ImageNames.length == 0) {
      return false;
    }
    for (var i = 0; i < $scope.formValues.ImageNames.length; i++) {
      if (!$scope.formValues.ImageNames[i].Valid) {
        return false;
      }
    }
    return true;
  };

  $scope.editorUpdate = function (cm) {
    $scope.formValues.DockerFileContent = cm.getValue();
    $scope.state.isEditorDirty = true;
  };

  this.uiCanExit = async function () {
    if ($scope.state.BuildType === 'editor' && $scope.formValues.DockerFileContent && $scope.state.isEditorDirty) {
      return ModalService.confirmWebEditorDiscard();
    }
  };

  $scope.selectAdditionalFiles = function (files) {
    $scope.formValues.AdditionalFiles = files;
  };
}
