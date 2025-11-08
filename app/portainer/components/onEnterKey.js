angular.module('portainer.app').directive('onEnterKey', [
  '$parse',
  function porOnEnterKey($parse) {
    var directive = {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onEnterKey);
        element.bind('keydown keypress', function (e) {
          if (e.which === 13) {
            e.preventDefault();
            scope.$apply(function () {
              fn(scope);
            });
          }
        });
      },
    };

    return directive;
  },
]);
