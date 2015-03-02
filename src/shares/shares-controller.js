app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['sharesService', function (sharesService) {
        return sharesService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['$log', 'sharesService', 'shares', 'Share', 'currentUser', function ($log, sharesService, shares, Share, currentUser) {
  var self = this;

  self.shares = shares;

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

  self.vote = function(index, share, num) {
    sharesService.vote(share._id, num).then(function(data){
      sharesService.getByShareId(share._id).then(function(data){
        self.shares.splice(index, 1, data);
      });
    });
  };

  self.addComment = function (share) {
    sharesService.addComment(share._id, share.newComment).then(function(data) {
      var comment = data;
      share.comments.push(comment);
      share.newComment = '';
    });
  };

  self.listComments = function (share) {
    sharesService.listComments(share._id).then(function(data) {
      share.comments = data;
    });
  };

  self.toggleComments = function (share) {
    if (!share.showComments) {
      share.showComments = true;
      self.listComments(share);
    } else {
      share.showComments = false;
    }
  };

}]);
