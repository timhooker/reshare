app.factory('currentUser', ['$http', function($http) {

  var current = {
    user: undefined
  };

  $http.get('/api/users/me').then(function(result) {
    current.user = result.data;
  }).catch(function(err) {
    current.user = undefined;
  });

  return current;
}]);
