app.factory('usersService', ['$http', '$q', '$log', 'ajaxHelper', function($http, $q, $log, ajaxHelper) {
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
    }
  };
}]);
