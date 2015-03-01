app.factory('Share', ['$log', function($log) {

  return function(spec) {
    spec = spec || {};
    $log.log('new');

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [''],

      addTag: function(tag) {
        var index = self.tags.indexOf(tag);

        if (index >= 0) {
          self.tags.splice(index, 1);
        } else if (tag === undefined || !tag) {
          tag = '';
        }
        self.tags.splice(0, 0, tag);
      },

      removeTag: function(index, $event) {
        console.log($event);
        $event.preventDefault();
        self.tags.splice(index, 1);
      }
    };

    return self;
  };
}]);
