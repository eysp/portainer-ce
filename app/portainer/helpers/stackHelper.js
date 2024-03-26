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

    helper.validateYAML = validateYAML;

    return helper;
  },
]);

function validateYAML(yaml, containerNames, originalContainersNames = []) {
  let yamlObject;

  try {
    yamlObject = YAML.parse(yaml);
  } catch (err) {
    return 'YAML 语法错误: ' + err;
  }

  const names = _.uniq(GenericHelper.findDeepAll(yamlObject, 'container_name'));

  const duplicateContainers = _.intersection(_.difference(containerNames, originalContainersNames), names);

  if (duplicateContainers.length === 0) {
    return '';
  }

  return (
    (duplicateContainers.length === 1 ? '该容器名称已被' : '这些容器名称已被') +
    ' 此环境中其他正在运行的容器使用: ' +
    _.join(duplicateContainers, ', ') +
    '.'
  );
}

export function extractContainerNames(yaml = '') {
  let yamlObject;

  try {
    yamlObject = YAML.parse(yaml);
  } catch (err) {
    return [];
  }

  return _.uniq(GenericHelper.findDeepAll(yamlObject, 'container_name'));
}
