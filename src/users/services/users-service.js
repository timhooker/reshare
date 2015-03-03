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
