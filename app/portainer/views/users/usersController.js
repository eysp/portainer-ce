import _ from 'lodash-es';

angular.module('portainer.app').controller('UsersController', [
  '$q',
  '$scope',
  '$state',
  'UserService',
  'TeamService',
  'TeamMembershipService',
  'ModalService',
  'Notifications',
  'Authentication',
  'SettingsService',
  function ($q, $scope, $state, UserService, TeamService, TeamMembershipService, ModalService, Notifications, Authentication, SettingsService) {
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
          Notifications.success('成功创建用户', username);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法创建用户');
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    function deleteSelectedUsers(selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (user) {
        UserService.deleteUser(user.Id)
          .then(function success() {
            Notifications.success('成功删除用户', user.Username);
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除用户');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    $scope.removeAction = function (selectedItems) {
      ModalService.confirmDeletion('你想删除所选的用户吗？他们将不能再登录到Portainer。', function onConfirm(confirmed) {
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
            user.RoleName = 'team leader';
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
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索到用户和团队');
          $scope.users = [];
          $scope.teams = [];
        });
    }

    initView();
  },
]);
