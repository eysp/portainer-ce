import { EventViewModel } from '../models/event';

angular.module('portainer.docker').factory('SystemService', [
  '$q',
  'System',
  'SystemEndpoint',
  function SystemServiceFactory($q, System, SystemEndpoint) {
    'use strict';
    var service = {};

    service.plugins = function () {
      var deferred = $q.defer();
      System.info({})
        .$promise.then(function success(data) {
          var plugins = data.Plugins;
          deferred.resolve(plugins);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法从系统中检索插件信息', err: err });
        });
      return deferred.promise;
    };

    service.info = function () {
      return System.info({}).$promise;
    };

    service.ping = function (endpointId) {
      return SystemEndpoint.ping({ endpointId: endpointId }).$promise;
    };

    service.version = function () {
      return System.version({}).$promise;
    };

    service.events = function (from, to) {
      var deferred = $q.defer();

      System.events({ since: from, until: to })
        .$promise.then(function success(data) {
          var events = data.map(function (item) {
            return new EventViewModel(item);
          });
          deferred.resolve(events);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索引擎事件', err: err });
        });

      return deferred.promise;
    };

    service.dataUsage = function () {
      return System.dataUsage().$promise;
    };

    return service;
  },
]);
