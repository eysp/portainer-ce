import angular from 'angular';
import PortainerError from 'Portainer/error';

angular.module('portainer.app').factory('CustomTemplateService', CustomTemplateServiceFactory);

/* @ngInject */
function CustomTemplateServiceFactory($sanitize, CustomTemplates, FileUploadService) {
  var service = {};

  service.customTemplate = function customTemplate(id) {
    return CustomTemplates.get({ id }).$promise;
  };

  service.customTemplates = async function customTemplates(type) {
    const templates = await CustomTemplates.query({ type }).$promise;
    templates.forEach((template) => {
      if (template.Note) {
        template.Note = $('<p>').html($sanitize(template.Note)).find('img').remove().end().html();
      }
    });
    return templates;
  };

  service.remove = function remove(id) {
    return CustomTemplates.remove({ id }).$promise;
  };

  service.customTemplateFile = async function customTemplateFile(id, remote = false) {
    try {
      const { FileContent } = remote ? await CustomTemplates.gitFetch({ id }).$promise : await CustomTemplates.file({ id }).$promise;
      return FileContent;
    } catch (err) {
      throw new PortainerError('无法检索自定义模板内容', err);
    }
  };

  service.updateCustomTemplate = async function updateCustomTemplate(id, customTemplate) {
    return CustomTemplates.update({ id }, customTemplate).$promise;
  };

  service.createCustomTemplateFromFileContent = async function createCustomTemplateFromFileContent(payload) {
    try {
      return await CustomTemplates.create({}, { method: 'string', ...payload }).$promise;
    } catch (err) {
      throw { msg: '无法创建自定义模板', err };
    }
  };

  service.createCustomTemplateFromFileUpload = async function createCustomTemplateFromFileUpload(payload) {
    try {
      const { data } = await FileUploadService.createCustomTemplate(payload);
      return data;
    } catch (err) {
      throw { msg: '无法创建自定义模板', err };
    }
  };

  service.createCustomTemplateFromGitRepository = async function createCustomTemplateFromGitRepository(payload) {
    try {
      return await CustomTemplates.create({}, { method: 'repository', ...payload }).$promise;
    } catch (err) {
      throw { msg: '无法创建自定义模板', err };
    }
  };

  return service;
}
