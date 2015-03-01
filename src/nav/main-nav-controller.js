app.controller('MainNavCtrl',
  ['$location', 'StringUtil', 'usersService', '$log', function($location, StringUtil, usersService, $log) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }
      return StringUtil.startsWith($location.path(), path);
    };

    self.currentUser = undefined;
    usersService.getCurrentUser().then(function(data) {
      self.currentUser = data;
    });
  }]);
