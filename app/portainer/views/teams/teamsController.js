import _ from 'lodash-es';

angular.module('portainer.app').controller('TeamsController', [
  '$q',
  '$scope',
  '$state',
  'TeamService',
  'UserService',
  'ModalService',
  'Notifications',
  'Authentication',
  function ($q, $scope, $state, TeamService, UserService, ModalService, Notifications, Authentication) {
    $scope.state = {
      actionInProgress: false,
    };

    $scope.formValues = {
      Name: '',
      Leaders: [],
    };

    $scope.checkNameValidity = function (form) {
      var valid = true;
      for (var i = 0; i < $scope.teams.length; i++) {
        if ($scope.formValues.Name === $scope.teams[i].Name) {
          valid = false;
          break;
        }
      }
      form.team_name.$setValidity('validName', valid);
    };

    $scope.addTeam = function () {
      var teamName = $scope.formValues.Name;
      var leaderIds = [];
      angular.forEach($scope.formValues.Leaders, function (user) {
        leaderIds.push(user.Id);
      });

      $scope.state.actionInProgress = true;
      TeamService.createTeam(teamName, leaderIds)
        .then(function success() {
          Notifications.success('团队创建成功', teamName);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法创建团队');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    $scope.removeAction = function (selectedItems) {
      ModalService.confirmDeletion('您要删除选定的团队吗？ 团队中的用户不会被删除。', function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        deleteSelectedTeams(selectedItems);
      });
    };

    function deleteSelectedTeams(selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (team) {
        TeamService.deleteTeam(team.Id)
          .then(function success() {
            Notifications.success('团队成功删除', team.Name);
            var index = $scope.teams.indexOf(team);
            $scope.teams.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除团队');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function initView() {
      var userDetails = Authentication.getUserDetails();
      var isAdmin = Authentication.isAdmin();
      $scope.isAdmin = isAdmin;
      $q.all({
        users: UserService.users(false),
        teams: isAdmin ? TeamService.teams() : UserService.userLeadingTeams(userDetails.ID),
      })
        .then(function success(data) {
          var teams = data.teams;
          $scope.teams = teams;
          $scope.users = _.orderBy(data.users, 'Username', 'asc');
        })
        .catch(function error(err) {
          $scope.teams = [];
          $scope.users = [];
          Notifications.error('失败', err, '无法检索团队');
        });
    }

    initView();
  },
]);
