app.factory('Share', function() {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: [],

      addTag: function(tag) {
        self.tags.push(tag || '');
      },

      removeTag: function(tag) {
        var index = self.tags.indexOf(tag);

        if (index >= 0) {
          self.tags.splice(index, 1);
        }
      }
    };

    return self;
  };
});
