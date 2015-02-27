// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };
  }]);

app.factory('Share', function() {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [1, 2, 3],

      addTag: function($event, tag) {
        $event.preventDefault();
        if (!tag) {
          tag = '';
        }
        console.log(tag);
        self.tags.push(tag);
        console.log(self.tags);
      },

      removeTag: function($event, index) {
        $event.preventDefault();
        self.tags.splice(index, 1);
      }
    };

    return self;
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['sharesService', function (sharesService) {
        return sharesService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['$log', 'sharesService', 'shares', 'Share', function ($log, sharesService, shares, Share) {
  var self = this;

  self.shares = shares;

  self.newShare = Share();

  self.addShare = function () {
    var share = self.newShare;

    sharesService.addShare(share).then(function () {

      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });

      self.shares.push(share);
    });

    self.newShare = Share();
  };
}]);

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'usersService', function ($route, usersService) {
        var routeParams = $route.current.params;
        return usersService.getByUserId(routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', function (user) {
  this.user = user;
}]);

app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId || '',
      role: spec.role || 'user'
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl',
    controllerAs: 'vm',
    resolve: {
      users: ['usersService', function (usersService) {
        return usersService.list();
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'usersService', 'User', function (users, usersService, User) {
  var self = this;

  self.users = users;

  self.newUser = User();

  self.addUser = function () {
    // Make a copy of the 'newUser' object
    var user = User(self.newUser);

    // Add the user to our service
    usersService.addUser(user).then(function () {
      // If the add succeeded, remove the user from the users array
      self.users = self.users.filter(function (existingUser) {
        return existingUser.userId !== user.userId;
      });

      // Add the user to the users array
      self.users.push(user);
    });

    // Clear our newUser property
    self.newUser = User();
  };
}]);

app.factory('sharesService', ['$http', '$log', function($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/res');
    },

    getByShareId: function (shareId) {
      if (!shareId) {
        throw new Error('getByShareId requires a share id');
      }

      return get('/api/res/' + shareId);
    },

    addShare: function (share) {
      return processAjaxPromise($http.post('/api/res', share));
    }
  };
}]);

app.factory('usersService', ['$http', '$q', '$log', function($http, $q, $log) {
  // My $http promise then and catch always
  // does the same thing, so I'll put the
  // processing of it here. What you probably
  // want to do instead is create a convenience object
  // that makes $http calls for you in a standard
  // way, handling post, put, delete, etc
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/users');
    },

    getByUserId: function (userId) {
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return get('/api/users/' + userId);
    },

    addUser: function (user) {
      return processAjaxPromise($http.post('/api/users', user));
    }
  };
}]);

//# sourceMappingURL=app.js.map