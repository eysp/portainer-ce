import { NetworkViewModel } from '../models/network';

angular.module('portainer.docker').factory('NetworkService', [
  '$q',
  'Network',
  function NetworkServiceFactory($q, Network) {
    'use strict';
    var service = {};

    service.create = function (networkConfiguration) {
      var deferred = $q.defer();

      Network.create(networkConfiguration)
        .$promise.then(function success(data) {
          deferred.resolve(data);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法创建网络', err: err });
        });
      return deferred.promise;
    };

    service.network = function (id) {
      var deferred = $q.defer();

      Network.get({ id: id })
        .$promise.then(function success(data) {
          var network = new NetworkViewModel(data);
          deferred.resolve(network);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索网络详情', err: err });
        });

      return deferred.promise;
    };

    service.networks = function (localNetworks, swarmNetworks, swarmAttachableNetworks, filters) {
      var deferred = $q.defer();

      Network.query({ filters: filters })
        .$promise.then(function success(data) {
          var networks = data;
          var filteredNetworks = networks
            .filter(function (network) {
              if (localNetworks && network.Scope === 'local') {
                return network;
              }
              if (swarmNetworks && network.Scope === 'swarm') {
                return network;
              }
              if (swarmAttachableNetworks && network.Scope === 'swarm' && network.Attachable === true) {
                return network;
              }
            })
            .map(function (item) {
              return new NetworkViewModel(item);
            });

          deferred.resolve(filteredNetworks);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索网络', err: err });
        });

      return deferred.promise;
    };

    service.remove = function (id) {
      return Network.remove({ id: id }).$promise;
    };

    service.disconnectContainer = function (networkId, containerId, force) {
      return Network.disconnect({ id: networkId }, { Container: containerId, Force: force }).$promise;
    };

    service.connectContainer = function (networkId, containerId, aliases) {
      var payload = {
        Container: containerId,
      };
      if (aliases) {
        payload.EndpointConfig = {
          Aliases: aliases,
        };
      }
      return Network.connect({ id: networkId }, payload).$promise;
    };

    return service;
  },
]);
