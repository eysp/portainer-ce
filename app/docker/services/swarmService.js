import { SwarmViewModel } from '../models/swarm';

angular.module('portainer.docker').factory('SwarmService', [
  '$q',
  'Swarm',
  function SwarmServiceFactory($q, Swarm) {
    'use strict';
    var service = {};

    service.swarm = function (endpointId) {
      var deferred = $q.defer();

      Swarm.get(endpointId ? { endpointId } : undefined)
        .$promise.then(function success(data) {
          var swarm = new SwarmViewModel(data);
          deferred.resolve(swarm);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索 Swarm 详情', err: err });
        });

      return deferred.promise;
    };

    return service;
  },
]);
