import uuidv4 from 'uuid/v4';
import { RepositoryMechanismTypes } from 'Kubernetes/models/deploy';
class KubernetesRedeployAppGitFormController {
  /* @ngInject */
  constructor($async, $state, StackService, ModalService, Notifications, WebhookHelper) {
    this.$async = $async;
    this.$state = $state;
    this.StackService = StackService;
    this.ModalService = ModalService;
    this.Notifications = Notifications;
    this.WebhookHelper = WebhookHelper;

    this.state = {
      saveGitSettingsInProgress: false,
      redeployInProgress: false,
      showConfig: false,
      isEdit: false,
      hasUnsavedChanges: false,
    };

    this.formValues = {
      RefName: '',
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
      // auto update
      AutoUpdate: {
        RepositoryAutomaticUpdates: false,
        RepositoryMechanism: RepositoryMechanismTypes.INTERVAL,
        RepositoryFetchInterval: '5m',
        RepositoryWebhookURL: '',
      },
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
    this.state.hasUnsavedChanges = angular.toJson(this.savedFormValues) !== angular.toJson(this.formValues);
  }

  buildAnalyticsProperties() {
    const metadata = {
      'automatic-updates': automaticUpdatesLabel(this.formValues.AutoUpdate.RepositoryAutomaticUpdates, this.formValues.AutoUpdate.RepositoryMechanism),
    };

    return { metadata };

    function automaticUpdatesLabel(repositoryAutomaticUpdates, repositoryMechanism) {
      switch (repositoryAutomaticUpdates && repositoryMechanism) {
        case RepositoryMechanismTypes.INTERVAL:
          return 'polling';
        case RepositoryMechanismTypes.WEBHOOK:
          return 'webhook';
        default:
          return 'off';
      }
    }
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
        await this.$state.reload();
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
        this.savedFormValues = angular.copy(this.formValues);
        this.state.hasUnsavedChanges = false;
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
    // Init auto update
    if (this.stack.AutoUpdate && (this.stack.AutoUpdate.Interval || this.stack.AutoUpdate.Webhook)) {
      this.formValues.AutoUpdate.RepositoryAutomaticUpdates = true;

      if (this.stack.AutoUpdate.Interval) {
        this.formValues.AutoUpdate.RepositoryMechanism = RepositoryMechanismTypes.INTERVAL;
        this.formValues.AutoUpdate.RepositoryFetchInterval = this.stack.AutoUpdate.Interval;
      } else if (this.stack.AutoUpdate.Webhook) {
        this.formValues.AutoUpdate.RepositoryMechanism = RepositoryMechanismTypes.WEBHOOK;
        this.formValues.AutoUpdate.RepositoryWebhookURL = this.WebhookHelper.returnStackWebhookUrl(this.stack.AutoUpdate.Webhook);
      }
    }

    if (!this.formValues.AutoUpdate.RepositoryWebhookURL) {
      this.formValues.AutoUpdate.RepositoryWebhookURL = this.WebhookHelper.returnStackWebhookUrl(uuidv4());
    }

    if (this.stack.GitConfig && this.stack.GitConfig.Authentication) {
      this.formValues.RepositoryUsername = this.stack.GitConfig.Authentication.Username;
      this.formValues.RepositoryAuthentication = true;
      this.state.isEdit = true;
    }

    this.savedFormValues = angular.copy(this.formValues);
  }
}

export default KubernetesRedeployAppGitFormController;
