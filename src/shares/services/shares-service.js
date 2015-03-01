app.factory('sharesService', ['$http', '$log', 'ajaxHelper', function($http, $log, ajaxHelper) {

  return {
    list: function () {
      return ajaxHelper.call($http.get('/api/res'));
    },

    getByShareId: function (shareId) {
      if (!shareId) {
        throw new Error('getByShareId requires a share id');
      }
      return ajaxHelper.call($http.get('/api/res/' + _id));
    },

    addShare: function (share) {
      return ajaxHelper.call($http.post('/api/res', share));
    }
  };

}]);
