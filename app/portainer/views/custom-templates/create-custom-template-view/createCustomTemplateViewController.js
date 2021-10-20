import _ from 'lodash';
import { AccessControlFormData } from 'Portainer/components/accessControlForm/porAccessControlFormModel';

class CreateCustomTemplateViewController {
  /* @ngInject */
  constructor($async, $state, $window, Authentication, ModalService, CustomTemplateService, FormValidator, Notifications, ResourceControlService, StackService, StateManager) {
    Object.assign(this, {
      $async,
      $state,
      $window,
      Authentication,
      ModalService,
      CustomTemplateService,
      FormValidator,
      Notifications,
      ResourceControlService,
      StackService,
      StateManager,
    });

    this.formValues = {
      Title: '',
      FileContent: '',
      File: null,
      RepositoryURL: '',
      RepositoryReferenceName: '',
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
      ComposeFilePathInRepository: 'docker-compose.yml',
      Description: '',
      Note: '',
      Logo: '',
      Platform: 1,
      Type: 1,
      AccessControlData: new AccessControlFormData(),
    };

    this.state = {
      Method: 'editor',
      formValidationError: '',
      actionInProgress: false,
      fromStack: false,
      loading: true,
      isEditorDirty: false,
    };
    this.templates = [];

    this.createCustomTemplate = this.createCustomTemplate.bind(this);
    this.createCustomTemplateAsync = this.createCustomTemplateAsync.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.createCustomTemplateByMethod = this.createCustomTemplateByMethod.bind(this);
    this.createCustomTemplateFromFileContent = this.createCustomTemplateFromFileContent.bind(this);
    this.createCustomTemplateFromFileUpload = this.createCustomTemplateFromFileUpload.bind(this);
    this.createCustomTemplateFromGitRepository = this.createCustomTemplateFromGitRepository.bind(this);
    this.editorUpdate = this.editorUpdate.bind(this);
    this.onChangeMethod = this.onChangeMethod.bind(this);
    this.onChangeFormValues = this.onChangeFormValues.bind(this);
  }

  createCustomTemplate() {
    return this.$async(this.createCustomTemplateAsync);
  }

  onChangeMethod() {
    this.formValues.FileContent = '';
    this.selectedTemplate = null;
  }

  async createCustomTemplateAsync() {
    let method = this.state.Method;

    if (method === 'template') {
      method = 'editor';
    }

    if (!this.validateForm(method)) {
      return;
    }

    this.state.actionInProgress = true;
    try {
      const customTemplate = await this.createCustomTemplateByMethod(method);

      const accessControlData = this.formValues.AccessControlData;
      const userDetails = this.Authentication.getUserDetails();
      const userId = userDetails.ID;
      await this.ResourceControlService.applyResourceControl(userId, accessControlData, customTemplate.ResourceControl);

      this.Notifications.success('已成功创建自定义模板');
      this.state.isEditorDirty = false;
      this.$state.go('docker.templates.custom');
    } catch (err) {
      this.Notifications.error('失败', err, '具有相同名称的模板已存在');
    } finally {
      this.state.actionInProgress = false;
    }
  }

  validateForm(method) {
    this.state.formValidationError = '';

    if (method === 'editor' && this.formValues.FileContent === '') {
      this.state.formValidationError = '模板文件内容不能为空';
      return false;
    }

    const title = this.formValues.Title;
    const isNotUnique = _.some(this.templates, (template) => template.Title === title);
    if (isNotUnique) {
      this.state.formValidationError = '具有相同名称的模板已存在';
      return false;
    }

    const isAdmin = this.Authentication.isAdmin();
    const accessControlData = this.formValues.AccessControlData;
    const error = this.FormValidator.validateAccessControl(accessControlData, isAdmin);

    if (error) {
      this.state.formValidationError = error;
      return false;
    }

    return true;
  }

  createCustomTemplateByMethod(method) {
    switch (method) {
      case 'editor':
        return this.createCustomTemplateFromFileContent();
      case 'upload':
        return this.createCustomTemplateFromFileUpload();
      case 'repository':
        return this.createCustomTemplateFromGitRepository();
    }
  }

  createCustomTemplateFromFileContent() {
    return this.CustomTemplateService.createCustomTemplateFromFileContent(this.formValues);
  }

  createCustomTemplateFromFileUpload() {
    return this.CustomTemplateService.createCustomTemplateFromFileUpload(this.formValues);
  }

  createCustomTemplateFromGitRepository() {
    return this.CustomTemplateService.createCustomTemplateFromGitRepository(this.formValues);
  }

  editorUpdate(cm) {
    this.formValues.FileContent = cm.getValue();
    this.state.isEditorDirty = true;
  }

  onChangeFormValues(newValues) {
    this.formValues = newValues;
  }

  async $onInit() {
    const applicationState = this.StateManager.getState();

    this.state.endpointMode = applicationState.endpoint.mode;
    let stackType = 0;
    if (this.state.endpointMode.provider === 'DOCKER_STANDALONE') {
      stackType = 2;
    } else if (this.state.endpointMode.provider === 'DOCKER_SWARM_MODE') {
      stackType = 1;
    }
    this.formValues.Type = stackType;

    const { fileContent, type } = this.$state.params;

    this.formValues.FileContent = fileContent;
    if (type) {
      this.formValues.Type = +type;
    }

    try {
      this.templates = await this.CustomTemplateService.customTemplates([1, 2]);
    } catch (err) {
      this.Notifications.error('加载失败', err, '加载自定义模板失败');
    }

    this.state.loading = false;

    this.$window.onbeforeunload = () => {
      if (this.state.Method === 'editor' && this.formValues.FileContent && this.state.isEditorDirty) {
        return '';
      }
    };
  }

  $onDestroy() {
    this.state.isEditorDirty = false;
  }

  async uiCanExit() {
    if (this.state.Method === 'editor' && this.formValues.FileContent && this.state.isEditorDirty) {
      return this.ModalService.confirmWebEditorDiscard();
    }
  }
}

export default CreateCustomTemplateViewController;
