app.factory('Share', function() {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [''],

      addTag: function(tag) {
        if (tag === undefined || !tag) {
          tag = '';
        }
        var index = self.tags.indexOf(tag);
        if (index >= 0) {
          return self.tags.splice(index, 1);
        }
        self.tags.splice(0, 0, tag);
      },

      removeTag: function(index) {
        self.tags.splice(index, 1);
      }
    };

    return self;
  };
});
