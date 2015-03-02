app.factory('currentUser', ['usersService', function(usersService) {

  return {
    user: undefined
  };
}]);
