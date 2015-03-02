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
