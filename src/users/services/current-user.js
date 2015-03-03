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
