import _ from 'lodash-es';
import { confirmDelete } from '@@/modals/confirm';
import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.app').controller('UsersController', [
  '$q',
  '$scope',
  '$state',
  'UserService',
  'TeamService',
  'TeamMembershipService',
  'Notifications',
  'Authentication',
  'SettingsService',
  function ($q, $scope, $state, UserService, TeamService, TeamMembershipService, Notifications, Authentication, SettingsService) {
    $scope.state = {
      userCreationError: '',
      validUsername: false,
      actionInProgress: false,
    };

    $scope.formValues = {
      Username: '',
      Password: '',
      ConfirmPassword: '',
      Administrator: false,
      TeamIds: [],
    };

    $scope.handleAdministratorChange = function (checked) {
      return $scope.$evalAsync(() => {
        $scope.formValues.Administrator = checked;
      });
    };

    $scope.onChangeTeamIds = function (teamIds) {
      return $scope.$evalAsync(() => {
        $scope.formValues.TeamIds = teamIds;
      });
    };

    $scope.checkUsernameValidity = function () {
      var valid = true;
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.formValues.Username.toLocaleLowerCase() === $scope.users[i].Username.toLocaleLowerCase()) {
          valid = false;
          break;
        }
      }
      $scope.state.validUsername = valid;
      $scope.state.userCreationError = valid ? '' : '用户名已被占用';
    };

    $scope.addUser = function () {
      $scope.state.actionInProgress = true;
      $scope.state.userCreationError = '';
      var username = $scope.formValues.Username;
      var password = $scope.formValues.Password;
      var role = $scope.formValues.Administrator ? 1 : 2;
      UserService.createUser(username, password, role, $scope.formValues.TeamIds)
        .then(function success() {
          Notifications.success('用户创建成功', username);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法创建用户');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    async function deleteSelectedUsers(selectedItems) {
      async function doRemove(user) {
        return UserService.deleteUser(user.Id)
          .then(function success() {
            Notifications.success('用户成功删除', user.Username);
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除用户');
          });
      }
      await processItemsInBatches(selectedItems, doRemove);
      $state.reload();
    }

    $scope.removeAction = function (selectedItems) {
      confirmDelete('您确定要删除选中的用户吗？删除后这些用户将无法再登录Portainer。').then((confirmed) => {
        if (!confirmed) {
          return;
        }
        deleteSelectedUsers(selectedItems);
      });
    };

    function assignTeamLeaders(users, memberships) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        user.isTeamLeader = false;
        for (var j = 0; j < memberships.length; j++) {
          var membership = memberships[j];
          if (user.Id === membership.UserId && membership.Role === 1) {
            user.isTeamLeader = true;
            user.RoleName = '团队领导';
            break;
          }
        }
      }
    }

    function initView() {
      var userDetails = Authentication.getUserDetails();
      var isAdmin = Authentication.isAdmin();
      $scope.isAdmin = isAdmin;
      $q.all({
        users: UserService.users(true),
        teams: isAdmin ? TeamService.teams() : UserService.userLeadingTeams(userDetails.ID),
        memberships: TeamMembershipService.memberships(),
        settings: SettingsService.publicSettings(),
      })
        .then(function success(data) {
          var users = data.users;
          assignTeamLeaders(users, data.memberships);
          $scope.users = users;
          $scope.teams = _.orderBy(data.teams, 'Name', 'asc');
          $scope.AuthenticationMethod = data.settings.AuthenticationMethod;
          $scope.requiredPasswordLength = data.settings.RequiredPasswordLength;
          $scope.teamSync = data.settings.TeamSync;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法获取用户和团队');
          $scope.users = [];
          $scope.teams = [];
        });
    }

    initView();
  },
]);
