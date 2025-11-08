import angular from 'angular';
// ng-focus-if pkg from: https://github.com/hiebj/ng-focus-if
angular.module('portainer.app').directive('focusIf', function ($timeout, $parse) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var dom = $element[0];
      var focusDelayFn = $attrs.focusDelay ? $parse($attrs.focusDelay) : null;
      if ($attrs.focusIf) {
        $scope.$watch($attrs.focusIf, focus);
      } else {
        focus(true);
      }
      function focus(condition) {
        if (condition) {
          var delay = focusDelayFn ? focusDelayFn($scope) : 0;
          $timeout(
            function () {
              dom.focus();
            },
            delay || 0
          );
        }
      }
    },
  };
});
