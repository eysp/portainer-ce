class KubernetesAppGitFormController {
  /* @ngInject */
  constructor($async, $state, StackService, ModalService, Notifications) {
    this.$async = $async;
    this.$state = $state;
    this.StackService = StackService;
    this.ModalService = ModalService;
    this.Notifications = Notifications;

    this.state = {
      saveGitSettingsInProgress: false,
      redeployInProgress: false,
      showConfig: true,
      isEdit: false,
    };

    this.formValues = {
      RefName: '',
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeRef = this.onChangeRef.bind(this);
  }

  onChangeRef(value) {
    this.onChange({ RefName: value });
  }

  onChange(values) {
    this.formValues = {
      ...this.formValues,
      ...values,
    };
  }

  async pullAndRedeployApplication() {
    return this.$async(async () => {
      try {
        const confirmed = await this.ModalService.confirmAsync({
          title: '你确定吗？',
          message: '对该应用程序的任何更改都将被git中的定义覆盖，并可能导致服务中断。你想继续吗？',
          buttons: {
            confirm: {
              label: '更新',
              className: 'btn-warning',
            },
          },
        });
        if (!confirmed) {
          return;
        }
        this.state.redeployInProgress = true;
        await this.StackService.updateKubeGit(this.stack.Id, this.stack.EndpointId, this.namespace, this.formValues);
        this.Notifications.success('已成功拉取并重新部署堆栈');
        await this.$state.reload(this.$state.current);
      } catch (err) {
        this.Notifications.error('失败', err, '重新部署应用程序失败');
      } finally {
        this.state.redeployInProgress = false;
      }
    });
  }

  async saveGitSettings() {
    return this.$async(async () => {
      try {
        this.state.saveGitSettingsInProgress = true;
        await this.StackService.updateKubeStack({ EndpointId: this.stack.EndpointId, Id: this.stack.Id }, null, this.formValues);
        this.Notifications.success('成功保存堆栈设置');
      } catch (err) {
        this.Notifications.error('失败', err, '无法保存应用程序设置');
      } finally {
        this.state.saveGitSettingsInProgress = false;
      }
    });
  }

  isSubmitButtonDisabled() {
    return this.state.saveGitSettingsInProgress || this.state.redeployInProgress;
  }

  $onInit() {
    this.formValues.RefName = this.stack.GitConfig.ReferenceName;
    if (this.stack.GitConfig && this.stack.GitConfig.Authentication) {
      this.formValues.RepositoryUsername = this.stack.GitConfig.Authentication.Username;
      this.formValues.RepositoryAuthentication = true;
      this.state.isEdit = true;
    }
  }
}

export default KubernetesAppGitFormController;
