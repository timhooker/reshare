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

    controller: ['$location', 'StringUtil', '$log', 'currentUser', '$scope', function($location, StringUtil, $log, currentUser, scope) {
      var self = this;

      self.isActive = function (path) {
        // The default route is a special case.
        if (path === '/') {
          return $location.path() === '/';
        }
        return StringUtil.startsWith($location.path(), path);
      };

      self.currentUser = currentUser;

      // self.close = function () {
      //   $scope.onclose();
      // };

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

      // console.log(element[0]);

      var addShareLink = document.querySelector('.add-share-link');

      addShareLink.onClick(function() {


      });
      console.log(addShareLink);

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
