app.controller('MainNavCtrl',
  ['$location', 'StringUtil', '$log', 'currentUser', function($location, StringUtil, $log, currentUser) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }
      return StringUtil.startsWith($location.path(), path);
    };

    self.currentUser = currentUser;
    
  }]);
