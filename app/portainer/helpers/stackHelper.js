import _ from 'lodash-es';
import YAML from 'yaml';
import GenericHelper from '@/portainer/helpers/genericHelper';
import { ExternalStackViewModel } from '@/portainer/models/stack';

angular.module('portainer.app').factory('StackHelper', [
  function StackHelperFactory() {
    'use strict';
    var helper = {};

    helper.getExternalStacksFromContainers = function (containers) {
      return getExternalStacksFromLabel(containers, 'com.docker.compose.project', 2);
    };

    helper.getExternalStacksFromServices = function (services) {
      return getExternalStacksFromLabel(services, 'com.docker.stack.namespace', 1);
    };

    function getExternalStacksFromLabel(items, label, type) {
      return _.uniqBy(
        items.filter((item) => item.Labels && item.Labels[label]).map((item) => new ExternalStackViewModel(item.Labels[label], type, item.Created)),
        'Name'
      );
    }

    helper.validateYAML = function (yaml, containerNames) {
      let yamlObject;

      try {
        yamlObject = YAML.parse(yaml);
      } catch (err) {
        return 'yaml 语法有错误: ' + err;
      }

      const names = _.uniq(GenericHelper.findDeepAll(yamlObject, 'container_name'));
      const duplicateContainers = _.intersection(containerNames, names);

      if (duplicateContainers.length === 0) return;

      return (
        (duplicateContainers.length === 1 ? '这个容器名称是' : '这些容器名称是') +
        ' 已被在此环境中运行的另一个容器使用: ' +
        _.join(duplicateContainers, ', ') +
        '.'
      );
    };

    return helper;
  },
]);
