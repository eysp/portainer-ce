import { RegistryTypes } from 'Portainer/models/registryTypes';
import { RegistryCreateFormValues } from 'Portainer/models/registry';

class CreateRegistryController {
  /* @ngInject */
  constructor($async, $state, EndpointProvider, Notifications, RegistryService, RegistryGitlabService) {
    Object.assign(this, { $async, $state, EndpointProvider, Notifications, RegistryService, RegistryGitlabService });

    this.RegistryTypes = RegistryTypes;
    this.state = {
      actionInProgress: false,
      overrideConfiguration: false,
      gitlab: {
        get selectedItemCount() {
          return this.selectedItems.length || 0;
        },
        selectedItems: [],
      },
      originViewReference: 'portainer.registries',
    };

    this.createRegistry = this.createRegistry.bind(this);
    this.retrieveGitlabRegistries = this.retrieveGitlabRegistries.bind(this);
    this.createGitlabRegistries = this.createGitlabRegistries.bind(this);
  }

  useDefaultQuayConfiguration() {
    this.model.Quay.useOrganisation = false;
    this.model.Quay.organisationName = '';
  }

  selectQuayRegistry() {
    this.model.Name = 'Quay';
    this.model.URL = 'quay.io';
    this.model.Authentication = true;
    this.model.Quay = {};
    this.useDefaultQuayConfiguration();
  }

  useDefaultGitlabConfiguration() {
    this.model.URL = 'https://registry.gitlab.com';
    this.model.Gitlab.InstanceURL = 'https://gitlab.com';
  }

  selectGitlabRegistry() {
    this.model.Name = '';
    this.model.Authentication = true;
    this.model.Gitlab = {};
    this.useDefaultGitlabConfiguration();
  }

  selectAzureRegistry() {
    this.model.Name = '';
    this.model.URL = '';
    this.model.Authentication = true;
  }

  selectProGetRegistry() {
    this.model.Name = '';
    this.model.URL = '';
    this.model.BaseURL = '';
    this.model.Authentication = true;
  }

  selectCustomRegistry() {
    this.model.Name = '';
    this.model.URL = '';
    this.model.Authentication = false;
  }

  selectDockerHub() {
    this.model.Name = '';
    this.model.URL = 'docker.io';
    this.model.Authentication = true;
  }

  retrieveGitlabRegistries() {
    return this.$async(async () => {
      this.state.actionInProgress = true;
      try {
        this.gitlabProjects = await this.RegistryGitlabService.projects(this.model.Gitlab.InstanceURL, this.model.Token);
      } catch (err) {
        this.Notifications.error('失败', err, '无法检索项目');
      } finally {
        this.state.actionInProgress = false;
      }
    });
  }

  createGitlabRegistries() {
    return this.$async(async () => {
      try {
        this.state.actionInProgress = true;
        await this.RegistryService.createGitlabRegistries(this.model, this.state.gitlab.selectedItems);
        this.Notifications.success('已成功创建注册表');
        this.$state.go(this.state.originViewReference, { endpointId: this.EndpointProvider.endpointID() });
      } catch (err) {
        this.Notifications.error('失败', err, '无法创建注册表');
        this.state.actionInProgress = false;
      }
    });
  }

  createRegistry() {
    return this.$async(async () => {
      try {
        this.state.actionInProgress = true;
        await this.RegistryService.createRegistry(this.model);
        this.Notifications.success('注册表已成功创建');
        this.$state.go(this.state.originViewReference, { endpointId: this.EndpointProvider.endpointID() });
      } catch (err) {
        this.Notifications.error('失败', err, '无法创建注册表');
        this.state.actionInProgress = false;
      }
    });
  }

  $onInit() {
    this.model = new RegistryCreateFormValues();

    const origin = this.$transition$.originalTransition().from();
    if (origin.name && /^[a-z]+\.registries$/.test(origin.name)) {
      this.state.originViewReference = origin;
    }
  }
}

export default CreateRegistryController;
