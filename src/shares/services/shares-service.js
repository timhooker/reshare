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
