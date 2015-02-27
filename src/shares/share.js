app.factory('Share', function() {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [1, 2, 3],

      addTag: function($event, tag) {
        $event.preventDefault();
        if (!tag) {
          tag = '';
        }
        self.tags.push(tag);
      },

      removeTag: function($event, index) {
        $event.preventDefault();
        self.tags.splice(index, 1);
      }
    };

    return self;
  };
});
