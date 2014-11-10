// Generated by CoffeeScript 1.8.0
angular.module('turn/infiniteScroll', ['infiniteScrollTemplate']).constant('infiniteScrollDefaults', {
  interval: 100,
  tolerance: 100,
  disabledClassName: 'disabled'
}).directive('infiniteScroll', function($window, infiniteScrollDefaults) {
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
      disabledClassName: '&infiniteScrollDisabledClass',
      containerElement: '&infiniteScrollContainer',
      isLocal: '&infiniteScrollIsLocal'
    },
    link: function(scope, element, attrs) {
      var hasCustomizedContainer, isGlobal;
      if (!angular.isFunction(scope.fn)) {
        throw new TypeError("infinite-scroll expects scroll function to be defined on scope");
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
      hasCustomizedContainer = angular.isDefined(scope.containerElement());
      isGlobal = !hasCustomizedContainer && !scope.isLocal();
      angular.extend(scope, {
        timer: null,
        isLoading: false,
        containerHeight: 0,
        elementOffsetTop: element[0].offsetTop,
        container: hasCustomizedContainer ? (scope.containerElement())[0] : scope.isLocal() ? (element.parent())[0] : $window,
        check: function() {
          var containerOffsetCompetitor;
          if (scope.isLoading || scope.active === false) {
            return false;
          }
          containerOffsetCompetitor = scope.containerHeight + scope.tolerance - element[0].scrollHeight - scope.elementOffsetTop;
          if ((isGlobal && (scope.container.pageYOffset + containerOffsetCompetitor > 0)) || (!isGlobal && (scope.container.scrollTop + containerOffsetCompetitor + scope.elementOffsetTop > 0))) {
            return scope.load();
          }
        },
        load: function() {
          scope.isLoading = true;
          return (scope.fn()).then(scope.done, scope.deactivate);
        },
        done: function() {
          return scope.isLoading = false;
        },
        measure: function() {
          return scope.containerHeight = isGlobal ? scope.container.innerHeight : scope.container.offsetHeight;
        },
        deactivate: function() {
          scope.isLoading = false;
          return scope.setActive(false);
        },
        setActive: function(active) {
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
      return scope.$on('$destroy', function() {
        clearInterval(scope.timer);
        return $window.removeEventListener('resize', scope.measure);
      });
    }
  };
});
