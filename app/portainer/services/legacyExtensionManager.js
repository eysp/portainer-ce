import _ from 'lodash-es';

// TODO: legacy extension management
angular.module('portainer.app').factory('LegacyExtensionManager', [
  '$q',
  'PluginService',
  'SystemService',
  'NodeService',
  'LegacyExtensionService',
  function ExtensionManagerFactory($q, PluginService, SystemService, NodeService, LegacyExtensionService) {
    'use strict';
    var service = {};

    service.initEndpointExtensions = function (endpoint) {
      var deferred = $q.defer();

      if (endpoint.Status !== 1) {
        deferred.resolve([]);
        return deferred.promise;
      }

      SystemService.version()
        .then(function success(data) {
          var endpointAPIVersion = parseFloat(data.ApiVersion);

          return $q.all([endpointAPIVersion >= 1.25 ? initStoridgeExtension() : {}]);
        })
        .then(function success(data) {
          var extensions = data;
          deferred.resolve(extensions);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法连接到Docker环境', err: err });
        });

      return deferred.promise;
    };

    function initStoridgeExtension() {
      var deferred = $q.defer();

      PluginService.volumePlugins()
        .then(function success(data) {
          var volumePlugins = data;
          if (_.includes(volumePlugins, 'cio:latest')) {
            return registerStoridgeUsingSwarmManagerIP();
          } else {
            return deregisterStoridgeExtension();
          }
        })
        .then(function success(data) {
          deferred.resolve(data);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '存储扩展检查期间发生错误', err: err });
        });

      return deferred.promise;
    }

    function registerStoridgeUsingSwarmManagerIP() {
      var deferred = $q.defer();

      NodeService.getActiveManager()
        .then(function success(data) {
          var managerIP = data.Addr;
          var storidgeAPIURL = 'tcp://' + managerIP + ':8282';
          return LegacyExtensionService.registerStoridgeExtension(storidgeAPIURL);
        })
        .then(function success(data) {
          deferred.resolve(data);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '存储扩展初始化期间发生错误', err: err });
        });

      return deferred.promise;
    }

    function deregisterStoridgeExtension() {
      return LegacyExtensionService.deregisterStoridgeExtension();
    }

    return service;
  },
]);
