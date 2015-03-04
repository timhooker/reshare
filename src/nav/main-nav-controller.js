app.directive('shareNav', function () {

  return {

    replace: true,

    scope: {
      onclose: '='
    },

    templateUrl: '/nav/main-nav.html',

    controller: ['$location', 'StringUtil', '$log', 'currentUser', '$scope', '$anchorScroll',
    function($location, StringUtil, $log, currentUser, $scope, $anchorScroll) {
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

      self.showMobileNav = function($event) {
        if($event) {
          $event.stopPropagation();
        }
        if(self.mobileNavShow === true) {
          self.mobileNavShow = false;
          document.removeEventListener('click', hideNav);
        } else {
          self.mobileNavShow = true;
          document.addEventListener('click', hideNav);
        }
      };

      function hideNav(){
        $scope.$apply(function() {
          self.showMobileNav();
        });
      }


    }],

    controllerAs: 'vm',

    link: function ($scope, element, attrs, ctrl) {

      document.querySelector('.mobile-nav').addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  };
});
