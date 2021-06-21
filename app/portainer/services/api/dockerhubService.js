import { DockerHubViewModel } from '../../models/dockerhub';

angular.module('portainer.app').factory('DockerHubService', [
  '$q',
  'DockerHub',
  function DockerHubServiceFactory($q, DockerHub) {
    'use strict';
    var service = {};

    service.dockerhub = function () {
      var deferred = $q.defer();

      DockerHub.get()
        .$promise.then(function success(data) {
          var dockerhub = new DockerHubViewModel(data);
          deferred.resolve(dockerhub);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索 DockerHub 详细信息', err: err });
        });

      return deferred.promise;
    };

    service.update = function (dockerhub) {
      return DockerHub.update({}, dockerhub).$promise;
    };

    return service;
  },
]);
