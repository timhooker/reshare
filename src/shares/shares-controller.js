app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    // resolve: {
    //   shares: ['sharesService', function (sharesService) {
    //     return sharesService.list();
    //   }]
    // }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['$log', 'sharesService', 'Share', 'currentUser', function ($log, sharesService, Share, currentUser) {
  var self = this;

  sharesService.list().then(function(data){
    self.shares = data;
    self.shares.forEach(function(share) {
      self.listComments(share);
      share.shareStatus = 'Show';
    });
  });
  // self.shares = shares;

  self.newShare = Share();

  self.currentUser = currentUser;

  refreshShares = function() {
    sharesService.list().then(function(data){
      self.shares = data;
    });
  };

  self.addShare = function () {
    var share = self.newShare;
    self.newShare = Share();

    sharesService.addShare(share).then(function (data) {
      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });
      refreshShares();
    });
  };

  self.removeShare = function(share) {
    sharesService.removeShare(share._id).then(function (data) {
      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });
    });
  }

  self.vote = function(index, share, num) {
    sharesService.vote(share._id, num).then(function(data){
      sharesService.getByShareId(share._id).then(function(data){
        share.upvotes = data.upvotes;
        share.downvotes = data.downvotes;
        share.clearvotes = data.clearvotes;
      });
    });
  };

  self.addComment = function (share) {
    sharesService.addComment(share._id, share.newComment).then(function(data) {
      var comment = data;
      if(!share.comments) {
        share.comments = [];
      }
      share.comments.push(comment);
      share.newComment = '';
    });
  };

  self.listComments = function (share) {
    sharesService.listComments(share._id).then(function(data) {
      share.comments = data;
    });
  };

  self.removeComment = function (share, comment) {
    sharesService.removeComment(share._id, comment._id).then(function(data) {
      var index = share.comments.indexOf(comment);
      share.comments.splice(index, 1);
    });
  };

  self.toggleComments = function (share) {
    if (!share.showComments) {
      share.showComments = true;
      share.shareStatus = 'Hide';
    } else {
      share.showComments = false;
      share.shareStatus = 'Show';
    }
  };

}]);
