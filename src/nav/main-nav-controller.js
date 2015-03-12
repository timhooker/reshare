app.directive('shareNav', function () {

  return {

    replace: true,

    scope: {
      onclose: '='
    },

    templateUrl: '/nav/main-nav.html',

    controller: ['$location', 'StringUtil', '$log', 'currentUser', '$scope', '$anchorScroll', '$rootScope', '$timeout',
    function($location, StringUtil, $log, currentUser, $scope, $anchorScroll, $rootScope, $timeout) {
      var self = this;

      self.isActive = function (path) {
        // The default route is a special case.
        if (path === '/') {
          return $location.path() === '/';
        }
        return StringUtil.startsWith($location.path(), path);
      };

      self.currentUser = currentUser;
      
      // did this using angular $anchorScroll
      // when you set $location.has to the id
      // of an element, it will scroll there when you
      // call $anchorScroll
      self.goTo = function(elem) {
        $location.hash(elem);

        $anchorScroll();
      };

      self.location = $location.$$path;

      $rootScope.$on('$locationChangeSuccess', function() {
        self.location = $location.$$path;
      });

    }],

    controllerAs: 'vm',

    link: function ($scope, element, attrs, ctrl) {

      ctrl.showMobileNav = function($event) {
        if($event) {
          $event.stopPropagation();
        }
        if(ctrl.mobileNavShow === true) {
          ctrl.mobileNavShow = false;
          document.removeEventListener('click', hideNav);
        } else {
          ctrl.mobileNavShow = true;
          document.addEventListener('click', hideNav);
        }
      };

      function hideNav(){
        $scope.$apply(function() {
          ctrl.showMobileNav();
        });
      }
      document.querySelector('.mobile-nav').addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  };
});
