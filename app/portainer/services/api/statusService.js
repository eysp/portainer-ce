import { getSystemStatus } from '@/react/portainer/system/useSystemStatus';
import { StatusViewModel } from '../../models/status';

angular.module('portainer.app').factory('StatusService', StatusServiceFactory);

/* @ngInject */
function StatusServiceFactory($q) {
  'use strict';
  var service = {};

  service.status = function () {
    var deferred = $q.defer();

    getSystemStatus()
      .then(function success(data) {
        var status = new StatusViewModel(data);
        deferred.resolve(status);
      })
      .catch(function error(err) {
        deferred.reject({ msg: '无法获取应用程序状态', err: err });
      });

    return deferred.promise;
  };

  return service;
}
