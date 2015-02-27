app.factory('Share', function() {

  return function(spec) {
    spec = spec || {};

    var self = {
      url: spec.url,
      description: spec.description || '',
      tags: spec.tags || [1, 2, 3],

      addTag: function(tag, $event) {
        self.tags.push(tag);
      },

      removeTag: function($event, index) {
        $event.cancelBubble = true;
          self.tags.splice(index, 1);

        // var index = self.tags.indexOf(tag);
        // console.log(index);
        // if (index >= 0) {
        //   self.tags.splice(index, 1);
        // }
      }
    };

    return self;
  };
});
