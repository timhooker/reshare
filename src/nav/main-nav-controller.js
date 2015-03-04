app.directive('shareNav', function () {

  return {

    // transclude specifies that we are going to allow
    // inner content (e.g. our directive will wrap
    // some other content)

    replace: true,

    scope: {
      onclose: '='
    },

    templateUrl: '/nav/main-nav.html',

    controller: ['$location', 'StringUtil', '$log', 'currentUser', '$scope', '$anchorScroll',
    function($location, StringUtil, $log, currentUser, scope, $anchorScroll) {
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

      self.showMobileNav = function() {
        console.log('show modal');
        if(self.mobileNavShow) {
          self.mobileNavShow = false;
        } else {
          self.mobileNavShow = true;
        }
      };


    }],

    controllerAs: 'vm',

    link: function ($scope, element, attrs, ctrl) {


      var addShareLink = document.querySelector('.add-share-link');


      // console.log(addShareLink);

      // function closeModal () {
      //   // This is how we tell Angular that we're about
      //   // to change something. Since this event comes from
      //   // a non-Angular source, we need to do this...
      //   $scope.$apply(function() {
      //     ctrl.close();
      //   });
      // }
      //
      // // We don't want to close the modal if we clicked
      // // inside the modal...
      // element[0].addEventListener('click', function (e) {
      //   e.stopPropagation();
      // });
      //
      // setTimeout(function () {
      //   // We do want to close the modal if we click the document
      //   document.addEventListener('click', closeModal);
      //
      //   // When the directive is destroyed, remove the
      //   // click handler from document
      //   $scope.$on('$destroy', function () {
      //     document.removeEventListener('click', closeModal);
      //   });
      // });
    }
  };
});
