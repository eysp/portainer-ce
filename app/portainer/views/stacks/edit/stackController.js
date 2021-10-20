import { AccessControlFormData } from 'Portainer/components/accessControlForm/porAccessControlFormModel';

angular.module('portainer.app').controller('StackController', [
  '$async',
  '$q',
  '$scope',
  '$state',
  '$window',
  '$transition$',
  'StackService',
  'NodeService',
  'ServiceService',
  'TaskService',
  'ContainerService',
  'ServiceHelper',
  'TaskHelper',
  'Notifications',
  'FormHelper',
  'EndpointProvider',
  'EndpointService',
  'GroupService',
  'ModalService',
  'StackHelper',
  'ResourceControlService',
  'Authentication',
  'ContainerHelper',
  function (
    $async,
    $q,
    $scope,
    $state,
    $window,
    $transition$,
    StackService,
    NodeService,
    ServiceService,
    TaskService,
    ContainerService,
    ServiceHelper,
    TaskHelper,
    Notifications,
    FormHelper,
    EndpointProvider,
    EndpointService,
    GroupService,
    ModalService,
    StackHelper,
    ResourceControlService,
    Authentication,
    ContainerHelper
  ) {
    $scope.state = {
      actionInProgress: false,
      migrationInProgress: false,
      showEditorTab: false,
      yamlError: false,
      isEditorDirty: false,
    };

    $scope.formValues = {
      Prune: false,
      Endpoint: null,
      AccessControlData: new AccessControlFormData(),
      Env: [],
    };

    $window.onbeforeunload = () => {
      if ($scope.stackFileContent && $scope.state.isEditorDirty) {
        return '';
      }
    };

    $scope.$on('$destroy', function () {
      $scope.state.isEditorDirty = false;
    });

    $scope.handleEnvVarChange = handleEnvVarChange;
    function handleEnvVarChange(value) {
      $scope.formValues.Env = value;
    }

    $scope.duplicateStack = function duplicateStack(name, endpointId) {
      var stack = $scope.stack;
      var env = FormHelper.removeInvalidEnvVars($scope.formValues.Env);
      EndpointProvider.setEndpointID(endpointId);

      return StackService.duplicateStack(name, $scope.stackFileContent, env, endpointId, stack.Type).then(onDuplicationSuccess).catch(notifyOnError);

      function onDuplicationSuccess() {
        Notifications.success('Stack successfully duplicated');
        $state.go('docker.stacks', {}, { reload: true });
        EndpointProvider.setEndpointID(stack.EndpointId);
      }

      function notifyOnError(err) {
        Notifications.error('失败', err, 'Unable to duplicate stack');
      }
    };

    $scope.showEditor = function () {
      $scope.state.showEditorTab = true;
    };

    $scope.migrateStack = function (name, endpointId) {
      return $q(function (resolve) {
        ModalService.confirm({
          title: '你确定吗？',
          message:
            '此操作将在目标环境上部署此堆栈的新实例，请注意，这不会重新定位可能附加到此堆栈的任何持久卷的内容。',
          buttons: {
            confirm: {
              label: 'Migrate',
              className: 'btn-danger',
            },
          },
          callback: function onConfirm(confirmed) {
            if (!confirmed) {
              return resolve();
            }
            return resolve(migrateStack(name, endpointId));
          },
        });
      });
    };

    $scope.removeStack = function () {
      ModalService.confirmDeletion('是否要删除堆栈？相关服务也将被删除。', function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        deleteStack();
      });
    };

    function migrateStack(name, endpointId) {
      var stack = $scope.stack;
      var targetEndpointId = endpointId;

      var migrateRequest = StackService.migrateSwarmStack;
      if (stack.Type === 2) {
        migrateRequest = StackService.migrateComposeStack;
      }

      // TODO: this is a work-around for stacks created with Portainer version >= 1.17.1
      // The EndpointID property is not available for these stacks, we can pass
      // the current endpoint identifier as a part of the migrate request. It will be used if
      // the EndpointID property is not defined on the stack.
      var originalEndpointId = EndpointProvider.endpointID();
      if (stack.EndpointId === 0) {
        stack.EndpointId = originalEndpointId;
      }

      $scope.state.migrationInProgress = true;
      return migrateRequest(stack, targetEndpointId, name)
        .then(function success() {
          Notifications.success('堆栈已成功迁移', stack.Name);
          $state.go('docker.stacks', {}, { reload: true });
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法迁移堆栈');
        })
        .finally(function final() {
          $scope.state.migrationInProgress = false;
        });
    }

    function deleteStack() {
      var endpointId = +$state.params.endpointId;
      var stack = $scope.stack;

      StackService.remove(stack, $transition$.params().external, endpointId)
        .then(function success() {
          Notifications.success('堆栈已成功删除', stack.Name);
          $state.go('docker.stacks');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法删除堆栈 ' + stack.Name);
        });
    }

    $scope.associateStack = function () {
      var endpointId = +$state.params.endpointId;
      var stack = $scope.stack;
      var accessControlData = $scope.formValues.AccessControlData;
      $scope.state.actionInProgress = true;

      StackService.associate(stack, endpointId, $scope.orphanedRunning)
        .then(function success(data) {
          const resourceControl = data.ResourceControl;
          const userDetails = Authentication.getUserDetails();
          const userId = userDetails.ID;
          return ResourceControlService.applyResourceControl(userId, accessControlData, resourceControl);
        })
        .then(function success() {
          Notifications.success('堆栈已成功关联', stack.Name);
          $state.go('docker.stacks');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法关联堆栈 ' + stack.Name);
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    $scope.deployStack = function () {
      var stackFile = $scope.stackFileContent;
      var env = FormHelper.removeInvalidEnvVars($scope.formValues.Env);
      var prune = $scope.formValues.Prune;
      var stack = $scope.stack;

      // TODO: this is a work-around for stacks created with Portainer version >= 1.17.1
      // The EndpointID property is not available for these stacks, we can pass
      // the current endpoint identifier as a part of the update request. It will be used if
      // the EndpointID property is not defined on the stack.
      var endpointId = EndpointProvider.endpointID();
      if (stack.EndpointId === 0) {
        stack.EndpointId = endpointId;
      }

      $scope.state.actionInProgress = true;
      StackService.updateStack(stack, stackFile, env, prune)
        .then(function success() {
          Notifications.success('堆栈已成功部署');
          $scope.state.isEditorDirty = false;
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法创建堆栈');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    $scope.editorUpdate = function (cm) {
      if ($scope.stackFileContent.replace(/(\r\n|\n|\r)/gm, '') !== cm.getValue().replace(/(\r\n|\n|\r)/gm, '')) {
        $scope.state.isEditorDirty = true;
        $scope.stackFileContent = cm.getValue();
        $scope.state.yamlError = StackHelper.validateYAML($scope.stackFileContent, $scope.containerNames);
      }
    };

    $scope.stopStack = stopStack;
    function stopStack() {
      return $async(stopStackAsync);
    }
    async function stopStackAsync() {
      const confirmed = await ModalService.confirmAsync({
        title: '你确定吗？',
        message: '是否确实要停止此堆栈？',
        buttons: { confirm: { label: '停止', className: 'btn-danger' } },
      });
      if (!confirmed) {
        return;
      }

      $scope.state.actionInProgress = true;
      try {
        await StackService.stop($scope.stack.Id);
        $state.reload();
      } catch (err) {
        Notifications.error('失败', err, '无法停止堆栈');
      }
      $scope.state.actionInProgress = false;
    }

    $scope.startStack = startStack;
    function startStack() {
      return $async(startStackAsync);
    }
    async function startStackAsync() {
      $scope.state.actionInProgress = true;
      const id = $scope.stack.Id;
      try {
        await StackService.start(id);
        $state.reload();
      } catch (err) {
        Notifications.error('失败', err, '无法启动堆栈');
      }
      $scope.state.actionInProgress = false;
    }

    function loadStack(id) {
      var agentProxy = $scope.applicationState.endpoint.mode.agentProxy;

      EndpointService.endpoints()
        .then(function success(data) {
          $scope.endpoints = data.value;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索环境');
        });

      $q.all({
        stack: StackService.stack(id),
        groups: GroupService.groups(),
        containers: ContainerService.containers(true),
      })
        .then(function success(data) {
          var stack = data.stack;
          $scope.groups = data.groups;
          $scope.stack = stack;
          $scope.containerNames = ContainerHelper.getContainerNames(data.containers);

          $scope.formValues.Env = $scope.stack.Env;

          let resourcesPromise = Promise.resolve({});
          if (!stack.Status || stack.Status === 1) {
            resourcesPromise = stack.Type === 1 ? retrieveSwarmStackResources(stack.Name, agentProxy) : retrieveComposeStackResources(stack.Name);
          }

          return $q.all({
            stackFile: StackService.getStackFile(id),
            resources: resourcesPromise,
          });
        })
        .then(function success(data) {
          const isSwarm = $scope.stack.Type === 1;
          $scope.stackFileContent = data.stackFile;
          // workaround for missing status, if stack has resources, set the status to 1 (active), otherwise to 2 (inactive) (https://github.com/portainer/portainer/issues/4422)
          if (!$scope.stack.Status) {
            $scope.stack.Status = data.resources && ((isSwarm && data.resources.services.length) || data.resources.containers.length) ? 1 : 2;
          }

          if ($scope.stack.Status === 1) {
            if (isSwarm) {
              assignSwarmStackResources(data.resources, agentProxy);
            } else {
              assignComposeStackResources(data.resources);
            }
          }

          $scope.state.yamlError = StackHelper.validateYAML($scope.stackFileContent, $scope.containerNames);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索堆栈详细信息');
        });
    }

    function retrieveSwarmStackResources(stackName, agentProxy) {
      var stackFilter = {
        label: ['com.docker.stack.namespace=' + stackName],
      };

      return $q.all({
        services: ServiceService.services(stackFilter),
        tasks: TaskService.tasks(stackFilter),
        containers: agentProxy ? ContainerService.containers(1) : [],
        nodes: NodeService.nodes(),
      });
    }

    function assignSwarmStackResources(resources, agentProxy) {
      var services = resources.services;
      var tasks = resources.tasks;

      if (agentProxy) {
        var containers = resources.containers;
        for (var j = 0; j < tasks.length; j++) {
          var task = tasks[j];
          TaskHelper.associateContainerToTask(task, containers);
        }
      }

      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        ServiceHelper.associateTasksToService(service, tasks);
      }

      $scope.nodes = resources.nodes;
      $scope.tasks = tasks;
      $scope.services = services;
    }

    function retrieveComposeStackResources(stackName) {
      var stackFilter = {
        label: ['com.docker.compose.project=' + stackName],
      };

      return $q.all({
        containers: ContainerService.containers(1, stackFilter),
      });
    }

    function assignComposeStackResources(resources) {
      $scope.containers = resources.containers;
    }

    function loadExternalStack(name) {
      var stackType = $transition$.params().type;
      if (!stackType || (stackType !== '1' && stackType !== '2')) {
        Notifications.error('失败', null, '无效的类型URL参数。');
        return;
      }

      if (stackType === '1') {
        loadExternalSwarmStack(name);
      } else {
        loadExternalComposeStack(name);
      }
    }

    function loadExternalSwarmStack(name) {
      var agentProxy = $scope.applicationState.endpoint.mode.agentProxy;

      retrieveSwarmStackResources(name, agentProxy)
        .then(function success(data) {
          assignSwarmStackResources(data, agentProxy);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索堆栈详细信息');
        });
    }

    function loadExternalComposeStack(name) {
      retrieveComposeStackResources(name)
        .then(function success(data) {
          assignComposeStackResources(data);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索堆栈详细信息');
        });
    }

    this.uiCanExit = async function () {
      if ($scope.stackFileContent && $scope.state.isEditorDirty) {
        return ModalService.confirmWebEditorDiscard();
      }
    };

    async function initView() {
      var stackName = $transition$.params().name;
      $scope.stackName = stackName;

      $scope.currentEndpointId = EndpointProvider.endpointID();

      const regular = $transition$.params().regular == 'true';
      $scope.regular = regular;

      var external = $transition$.params().external == 'true';
      $scope.external = external;

      const orphaned = $transition$.params().orphaned == 'true';
      $scope.orphaned = orphaned;

      const orphanedRunning = $transition$.params().orphanedRunning == 'true';
      $scope.orphanedRunning = orphanedRunning;

      if (external || (orphaned && orphanedRunning)) {
        loadExternalStack(stackName);
      }

      if (regular || orphaned) {
        const stackId = $transition$.params().id;
        loadStack(stackId);
      }

      try {
        const endpoint = EndpointProvider.currentEndpoint();
        $scope.composeSyntaxMaxVersion = endpoint.ComposeSyntaxMaxVersion;
      } catch (err) {
        Notifications.error('失败', err, '无法检索 ComposeSyntaxMaxVersion');
      }

      $scope.stackType = $transition$.params().type;
    }

    initView();
  },
]);
