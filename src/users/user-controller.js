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
