angular.module('infiniteScrollTemplate', ['infinite-scroll.html']);

angular.module("infinite-scroll.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("infinite-scroll.html",
    "<div ng-transclude></div>");
}]);

// Generated by CoffeeScript 1.7.1
angular.module('turn/infiniteScroll', ['infiniteScrollTemplate']).constant('infiniteScrollDefaults', {
  interval: 100,
  tolerance: 0,
  disabledClassName: 'disabled'
}).directive('infiniteScroll', [
  '$window',
  'infiniteScrollDefaults',
  function ($window, infiniteScrollDefaults) {
    return {
      replace: true,
      restrict: 'A',
      templateUrl: 'infinite-scroll.html',
      transclude: true,
      scope: {
        fn: '&infiniteScroll',
        interval: '&infiniteScrollInterval',
        tolerance: '&infiniteScrollTolerance',
        active: '=infiniteScrollActive',
        disabledClassName: '&infiniteScrollDisabledClass'
      },
      link: function (scope, element, attrs) {
        if (!angular.isFunction(scope.fn)) {
          throw new TypeError('infinite-scroll expects scroll function to be defined on scope');
        }
        if (!angular.isNumber(scope.interval)) {
          scope.interval = infiniteScrollDefaults.interval;
        }
        if (!angular.isNumber(scope.tolerance)) {
          scope.tolerance = infiniteScrollDefaults.tolerance;
        }
        if (!angular.isString(scope.disabledClassName)) {
          scope.disabledClassName = infiniteScrollDefaults.disabledClassName;
        }
        angular.extend(scope, {
          timer: null,
          isLoading: false,
          windowHeight: 0,
          elementOffset: element.offset(),
          check: function () {
            if (scope.isLoading || !scope.active) {
              return false;
            }
            if ($window.pageYOffset + scope.windowHeight + scope.tolerance - element[0].scrollHeight - scope.elementOffset.top > 0) {
              return scope.load();
            }
          },
          load: function () {
            scope.isLoading = true;
            return scope.fn().then(scope.done, scope.deactivate);
          },
          done: function () {
            return scope.isLoading = false;
          },
          measure: function () {
            return scope.windowHeight = $window.innerHeight;
          },
          deactivate: function () {
            scope.isLoading = false;
            return scope.active = false;
          },
          setActive: function (active) {
            clearInterval(scope.timer);
            if (active) {
              element.removeClass(scope.disabledClassName);
              return scope.timer = setInterval(scope.check, scope.interval);
            } else {
              return element.addClass(scope.disabledClassName);
            }
          }
        });
        scope.measure();
        if (angular.isDefined(scope.active)) {
          scope.$watch('active', scope.setActive);
        } else {
          scope.setActive(true);
        }
        $window.addEventListener('resize', scope.measure);
        return scope.$on('$destroy', function () {
          clearInterval(scope.timer);
          return $window.removeEventListener('resize', scope.measure);
        });
      }
    };
  }
]);