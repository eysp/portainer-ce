import moment from 'moment';
import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { confirmContainerDeletion } from '@/react/docker/containers/common/confirm-container-delete-modal';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { ResourceControlType } from '@/react/portainer/access-control/types';
import { confirmContainerRecreation } from '@/react/docker/containers/ItemView/ConfirmRecreationModal';

angular.module('portainer.docker').controller('ContainerController', [
  '$q',
  '$scope',
  '$state',
  '$transition$',
  '$filter',
  '$async',
  'Commit',
  'ContainerHelper',
  'ContainerService',
  'ImageHelper',
  'NetworkService',
  'Notifications',
  'ResourceControlService',
  'RegistryService',
  'ImageService',
  'HttpRequestHelper',
  'Authentication',
  'endpoint',
  function (
    $q,
    $scope,
    $state,
    $transition$,
    $filter,
    $async,
    Commit,
    ContainerHelper,
    ContainerService,
    ImageHelper,
    NetworkService,
    Notifications,
    ResourceControlService,
    RegistryService,
    ImageService,
    HttpRequestHelper,
    Authentication,
    endpoint
  ) {
    $scope.resourceType = ResourceControlType.Container;
    $scope.endpoint = endpoint;
    $scope.isAdmin = Authentication.isAdmin();
    $scope.activityTime = 0;
    $scope.portBindings = [];
    $scope.displayRecreateButton = false;
    $scope.displayCreateWebhookButton = false;
    $scope.containerWebhookFeature = FeatureId.CONTAINER_WEBHOOK;

    $scope.config = {
      RegistryModel: new PorImageRegistryModel(),
      commitInProgress: false,
    };

    $scope.state = {
      recreateContainerInProgress: false,
      joinNetworkInProgress: false,
      leaveNetworkInProgress: false,
      pullImageValidity: false,
    };

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullImageValidity = validity;
    }

    $scope.updateRestartPolicy = updateRestartPolicy;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.computeDockerGPUCommand = () => {
      const gpuOptions = _.find($scope.container.HostConfig.DeviceRequests, function (o) {
        return o.Driver === 'nvidia' || o.Capabilities[0][0] === 'gpu';
      });
      if (!gpuOptions) {
        return 'No GPU config found';
      }
      let gpuStr = 'all';
      if (gpuOptions.Count !== -1) {
        gpuStr = `"device=${_.join(gpuOptions.DeviceIDs, ',')}"`;
      }
      // we only support a single set of capabilities for now
      // creation UI needs to be reworked in order to support OR combinations of AND capabilities
      const capStr = `"capabilities=${_.join(gpuOptions.Capabilities[0], ',')}"`;
      return `${gpuStr},${capStr}`;
    };

    var update = function () {
      var nodeName = $transition$.params().nodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);
      $scope.nodeName = nodeName;

      ContainerService.container($transition$.params().id)
        .then(function success(data) {
          var container = data;
          $scope.container = container;
          $scope.container.edit = false;
          $scope.container.newContainerName = $filter('trimcontainername')(container.Name);

          if (container.State.Running) {
            $scope.activityTime = moment.duration(moment(container.State.StartedAt).utc().diff(moment().utc())).humanize();
          } else if (container.State.Status === 'created') {
            $scope.activityTime = moment.duration(moment(container.Created).utc().diff(moment().utc())).humanize();
          } else {
            $scope.activityTime = moment.duration(moment().utc().diff(moment(container.State.FinishedAt).utc())).humanize();
          }

          $scope.portBindings = [];
          if (container.NetworkSettings.Ports) {
            _.forEach(Object.keys(container.NetworkSettings.Ports), function (key) {
              if (container.NetworkSettings.Ports[key]) {
                _.forEach(container.NetworkSettings.Ports[key], (portMapping) => {
                  const mapping = {};
                  mapping.container = key;
                  mapping.host = `${portMapping.HostIp}:${portMapping.HostPort}`;
                  $scope.portBindings.push(mapping);
                });
              }
            });
          }

          $scope.container.Config.Env = _.sortBy($scope.container.Config.Env, _.toLower);
          const inSwarm = $scope.container.Config.Labels['com.docker.swarm.service.id'];
          const autoRemove = $scope.container.HostConfig.AutoRemove;
          const admin = Authentication.isAdmin();
          const {
            allowContainerCapabilitiesForRegularUsers,
            allowHostNamespaceForRegularUsers,
            allowDeviceMappingForRegularUsers,
            allowSysctlSettingForRegularUsers,
            allowBindMountsForRegularUsers,
            allowPrivilegedModeForRegularUsers,
          } = endpoint.SecuritySettings;

          const settingRestrictsRegularUsers =
            !allowContainerCapabilitiesForRegularUsers ||
            !allowBindMountsForRegularUsers ||
            !allowDeviceMappingForRegularUsers ||
            !allowSysctlSettingForRegularUsers ||
            !allowHostNamespaceForRegularUsers ||
            !allowPrivilegedModeForRegularUsers;

          $scope.displayRecreateButton = !inSwarm && !autoRemove && (admin || !settingRestrictsRegularUsers);
          $scope.displayCreateWebhookButton = $scope.displayRecreateButton;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法获取容器信息');
        });
    };

    function executeContainerAction(id, action, successMessage, errorMessage) {
      action(id)
        .then(function success() {
          Notifications.success(successMessage, id);
          update();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, errorMessage);
        });
    }

    $scope.start = function () {
      var successMessage = '容器成功启动';
      var errorMessage = '无法启动容器';
      executeContainerAction($transition$.params().id, ContainerService.startContainer, successMessage, errorMessage);
    };

    $scope.stop = function () {
      var successMessage = '容器成功停止';
      var errorMessage = '无法停止容器';
      executeContainerAction($transition$.params().id, ContainerService.stopContainer, successMessage, errorMessage);
    };

    $scope.kill = function () {
      var successMessage = '容器成功终止';
      var errorMessage = '无法终止容器';
      executeContainerAction($transition$.params().id, ContainerService.killContainer, successMessage, errorMessage);
    };

    $scope.pause = function () {
      var successMessage = '容器成功暂停';
      var errorMessage = '无法暂停容器';
      executeContainerAction($transition$.params().id, ContainerService.pauseContainer, successMessage, errorMessage);
    };

    $scope.unpause = function () {
      var successMessage = '容器成功恢复';
      var errorMessage = '无法恢复容器';
      executeContainerAction($transition$.params().id, ContainerService.resumeContainer, successMessage, errorMessage);
    };

    $scope.restart = function () {
      var successMessage = '容器成功重启';
      var errorMessage = '无法重启容器';
      executeContainerAction($transition$.params().id, ContainerService.restartContainer, successMessage, errorMessage);
    };

    $scope.renameContainer = function () {
      var container = $scope.container;
      if (container.newContainerName === $filter('trimcontainername')(container.Name)) {
        $scope.container.edit = false;
        return;
      }
      ContainerService.renameContainer($transition$.params().id, container.newContainerName)
        .then(function success() {
          container.Name = container.newContainerName;
          Notifications.success('容器重命名成功', container.Name);
        })
        .catch(function error(err) {
          container.newContainerName = $filter('trimcontainername')(container.Name);
          Notifications.error('失败', err, '无法重命名容器');
        })
        .finally(function final() {
          $scope.container.edit = false;
          $scope.$apply();
        });
    };

    $scope.containerLeaveNetwork = function containerLeaveNetwork(container, networkId) {
      $scope.state.leaveNetworkInProgress = true;
      NetworkService.disconnectContainer(networkId, container.Id, false)
        .then(function success() {
          Notifications.success('容器已断开网络', container.Id);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法将容器从网络断开连接');
        })
        .finally(function final() {
          $scope.state.leaveNetworkInProgress = false;
        });
    };

    $scope.containerJoinNetwork = function containerJoinNetwork(container, networkId) {
      $scope.state.joinNetworkInProgress = true;
      NetworkService.connectContainer(networkId, container.Id)
        .then(function success() {
          Notifications.success('容器已加入网络', container.Id);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法将容器连接到网络');
        })
        .finally(function final() {
          $scope.state.joinNetworkInProgress = false;
        });
    };

    async function commitContainerAsync() {
      $scope.config.commitInProgress = true;
      const registryModel = $scope.config.RegistryModel;
      const imageConfig = ImageHelper.createImageConfigForContainer(registryModel);
      try {
        await Commit.commitContainer({ environmentId: endpoint.Id }, { id: $transition$.params().id, repo: imageConfig.fromImage }).$promise;
        Notifications.success('镜像已创建', $transition$.params().id);
        $state.reload();
      } catch (err) {
        Notifications.error('失败', err, '无法创建镜像');
        $scope.config.commitInProgress = false;
      }
    }

    $scope.commit = function () {
      return $async(commitContainerAsync);
    };

    $scope.confirmRemove = function () {
      return $async(async () => {
        var title = '您即将删除一个容器。';
        if ($scope.container.State.Running) {
          title = '您即将删除一个正在运行的容器。';
        }

        const result = await confirmContainerDeletion(title);

        if (!result) {
          return;
        }
        const { removeVolumes } = result;

        removeContainer(removeVolumes);
      });
    };

    function removeContainer(cleanAssociatedVolumes) {
      ContainerService.remove($scope.container, cleanAssociatedVolumes)
        .then(function success() {
          Notifications.success('成功', '容器已成功删除');;
          $state.go('docker.containers', {}, { reload: true });
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除容器');
        });
    }

    function recreateContainer(pullImage) {
      var container = $scope.container;
      $scope.state.recreateContainerInProgress = true;

      return ContainerService.recreateContainer(container.Id, pullImage).then(notifyAndChangeView).catch(notifyOnError);

      function notifyAndChangeView() {
        Notifications.success('成功', '容器成功重新创建');
        $state.go('docker.containers', {}, { reload: true });
      }

      function notifyOnError(err) {
        Notifications.error('失败', err, '无法重新创建容器');
        $scope.state.recreateContainerInProgress = false;
      }
    }

    $scope.recreate = function () {
      const cannotPullImage = !$scope.container.Config.Image || $scope.container.Config.Image.toLowerCase().startsWith('sha256');
      confirmContainerRecreation(cannotPullImage).then(function (result) {
        if (!result) {
          return;
        }

        recreateContainer(result.pullLatest);
      });
    };

    function updateRestartPolicy(restartPolicy, maximumRetryCount) {
      maximumRetryCount = restartPolicy === 'on-failure' ? maximumRetryCount : undefined;

      return ContainerService.updateRestartPolicy($scope.container.Id, restartPolicy, maximumRetryCount).then(onUpdateSuccess).catch(notifyOnError);

      function onUpdateSuccess() {
        $scope.container.HostConfig.RestartPolicy = {
          Name: restartPolicy,
          MaximumRetryCount: maximumRetryCount,
        };
        Notifications.success('成功', '重启策略已更新');
      }

      function notifyOnError(err) {
        Notifications.error('失败', err, '无法更新重启策略');
        return $q.reject(err);
      }
    }

    var provider = $scope.applicationState.endpoint.mode.provider;
    var apiVersion = $scope.applicationState.endpoint.apiVersion;
    NetworkService.networks(provider === 'DOCKER_STANDALONE' || provider === 'DOCKER_SWARM_MODE', false, provider === 'DOCKER_SWARM_MODE' && apiVersion >= 1.25)
      .then(function success(data) {
        var networks = data;
        $scope.availableNetworks = networks;
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法检索网络');
      });

    update();
  },
]);
