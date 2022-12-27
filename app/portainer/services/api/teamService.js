import { TeamViewModel } from '../../models/team';
import { TeamMembershipModel } from '../../models/teamMembership';

angular.module('portainer.app').factory('TeamService', [
  '$q',
  'Teams',
  function TeamServiceFactory($q, Teams) {
    'use strict';
    var service = {};

    service.teams = function (environmentId) {
      var deferred = $q.defer();
      Teams.query({ environmentId: environmentId })
        .$promise.then(function success(data) {
          var teams = data.map(function (item) {
            return new TeamViewModel(item);
          });
          deferred.resolve(teams);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索到团队', err: err });
        });
      return deferred.promise;
    };

    service.team = function (id) {
      var deferred = $q.defer();
      Teams.get({ id: id })
        .$promise.then(function success(data) {
          var team = new TeamViewModel(data);
          deferred.resolve(team);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索到团队的详细信息', err: err });
        });
      return deferred.promise;
    };

    service.createTeam = function (name, leaderIds) {
      var deferred = $q.defer();
      var payload = {
        Name: name,
        TeamLeaders: leaderIds,
      };
      Teams.create({}, payload)
        .$promise.then(function success() {
          deferred.resolve();
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法创建团队', err: err });
        });
      return deferred.promise;
    };

    service.deleteTeam = function (id) {
      return Teams.remove({ id: id }).$promise;
    };

    service.userMemberships = function (id) {
      var deferred = $q.defer();
      Teams.queryMemberships({ id: id })
        .$promise.then(function success(data) {
          var memberships = data.map(function (item) {
            return new TeamMembershipModel(item);
          });
          deferred.resolve(memberships);
        })
        .catch(function error(err) {
          deferred.reject({ msg: '无法检索团队的用户会员资格', err: err });
        });
      return deferred.promise;
    };

    return service;
  },
]);
