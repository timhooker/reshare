app.factory('Share', ['$log', function($log) {

  return function(spec) {
    spec = spec || {};
    $log.log('new');

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

      removeTag: function(index, $event) {
        $event.preventDefault();
        self.tags.splice(index, 1);
      },

      vote: function(num) {
        $log.log(num);
        if (num === 1) {
          ++self.upvotes;
        } else if (num === -1) {
          ++self.downvotes;
        }
        sharesService.vote(self._id, num);
      }
    };

    return self;
  };
}]);
