// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

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

app.factory('Share', ['$log', function($log) {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [''],
      _id: spec._id || undefined,
      upvotes: 0,
      downvotes: 0,

      addTag: function(tag) {
        var index = self.tags.indexOf(tag);

        if (index >= 0) {
          self.tags.splice(index, 1);
        } else if (tag === undefined || !tag) {
          tag = '';
        }
        self.tags.splice(0, 0, tag);
      },

      removeTag: function(index) {
        self.tags.splice(index, 1);
      }
    };

    return self;
  };
}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    // resolve: {
    //   shares: ['sharesService', function (sharesService) {
    //     return sharesService.list();
    //   }]
    // }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['$log', 'sharesService', 'Share', 'currentUser', function ($log, sharesService, Share, currentUser) {
  var self = this;

  sharesService.list().then(function(data){
    self.shares = data;
    self.shares.forEach(function(share) {
      self.listComments(share);
      share.shareStatus = 'Show';
    });
  });
  // self.shares = shares;

  self.newShare = Share();

  self.currentUser = currentUser;

  refreshShares = function() {
    sharesService.list().then(function(data){
      self.shares = data;
    });
  };

  self.addShare = function () {
    var share = self.newShare;
    self.newShare = Share();

    sharesService.addShare(share).then(function (data) {
      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });
      refreshShares();
    });
  };

  self.removeShare = function(share) {
    sharesService.removeShare(share._id).then(function (data) {
      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });
    });
  };

  self.vote = function(index, share, num) {
    sharesService.vote(share._id, num).then(function(data){
      sharesService.getByShareId(share._id).then(function(data){
        share.upvotes = data.upvotes;
        share.downvotes = data.downvotes;
        share.clearvotes = data.clearvotes;
      });
    });
  };

  self.addComment = function (share) {
    sharesService.addComment(share._id, share.newComment).then(function(data) {
      var comment = data;
      if(!share.comments) {
        share.comments = [];
      }
      share.comments.push(comment);
      share.newComment = '';
    });
  };

  self.listComments = function (share) {
    sharesService.listComments(share._id).then(function(data) {
      share.comments = data;
    });
  };

  self.removeComment = function (share, comment) {
    sharesService.removeComment(share._id, comment._id).then(function(data) {
      var index = share.comments.indexOf(comment);
      share.comments.splice(index, 1);
    });
  };

  self.toggleComments = function (share) {
    if (!share.showComments) {
      share.showComments = true;
      share.shareStatus = 'Hide';
    } else {
      share.showComments = false;
      share.shareStatus = 'Show';
    }
  };

}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'usersService', function ($route, usersService) {
        var routeParams = $route.current.params;
        return usersService.getByUserId(routeParams.userid);
      }],
      github: ['$route', '$http', function ($route, $http) {
        var routeParams = $route.current.params;
        return $http.get('https://api.github.com/users/' + routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', 'github', function (user, github) {
  this.user = user;
  this.github = github.data;
  console.log(this.github);
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

app.factory('ajaxHelper', ['$log', function($log) {
  return {
    call: function(p) {
      return p.then(function (result) {
        return result.data;
      })
      .catch(function (error) {
        $log.log(error);
      });
    }
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

app.factory('sharesService', ['$http', '$log', 'ajaxHelper', function($http, $log, ajaxHelper) {

  return {
    list: function () {
      return ajaxHelper.call($http.get('/api/res'));
    },

    getByShareId: function (shareId) {
      if (!shareId) {
        throw new Error('getByShareId requires a share id');
      }
      return ajaxHelper.call($http.get('/api/res/' + shareId));
    },

    addShare: function (share) {
      return ajaxHelper.call($http.post('/api/res', share));
    },

    removeShare: function (shareId) {
      return ajaxHelper.call($http.delete('/api/res/' + shareId));
    },

    vote: function(id, num) {
      var vote = { vote: num };
      return ajaxHelper.call($http.post('/api/res/' + id + '/votes', vote));
    },

    addComment: function (shareId, text) {
      var comment = { text: text };
      return ajaxHelper.call($http.post('/api/res/' + shareId + '/comments', comment));
    },

    removeComment: function (shareId, id) {
      return ajaxHelper.call($http.delete('/api/res/' + shareId + '/comments/' + id));
    },

    listComments: function (shareId) {
      return ajaxHelper.call($http.get('/api/res/' + shareId + '/comments'));
    }
  };
}]);

app.factory('currentUser', ['$http', function($http) {

  var current = {
    user: undefined,
    github: undefined
  };

  $http.get('/api/users/me').then(function(result) {
    current.user = result.data;
    $http.get('https://api.github.com/users/' + current.user.userId ).then(function(result) {
      current.github = result.data;
    });
  }).catch(function(err) {
    current.user = undefined;
  });

  return current;
}]);

app.factory('usersService', ['$http', '$q', '$log', 'ajaxHelper', function($http, $q, $log, ajaxHelper) {

  return {
    list: function () {
      return ajaxHelper.call($http.get('/api/users'));
    },

    getByUserId: function (userId) {
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return ajaxHelper.call($http.get('/api/users/' + userId));
    },

    addUser: function (user) {
      return ajaxHelper.call($http.post('/api/users', user));
    },

    getCurrentUser: function() {
      return ajaxHelper.call($http.get('/api/users/me'));
    }

  };
}]);

//# sourceMappingURL=app.js.map