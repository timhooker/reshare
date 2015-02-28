app.factory('ajaxHelper', function() {
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
});
