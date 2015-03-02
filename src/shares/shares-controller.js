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
.controller('SharesCtrl', ['$log', 'sharesService', 'shares', 'Share', function ($log, sharesService, shares, Share) {
  var self = this;

  self.shares = shares;
  console.log(self.shares);

  self.newShare = Share();

  refreshShares = function() {
    sharesService.list().then(function(data){
      self.shares = data;
    });
  };

  self.addShare = function () {
    var share = self.newShare;
    self.newShare = Share();

    sharesService.addShare(share).then(function () {

      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });
      refreshShares();

    });
  };

  self.vote = function(share, num) {
    if (num === 1) {
      ++share.upvotes;
      var value = 'upvotes';
    } else if (num === -1) {
      var value = 'downvotes';
      ++share.downvotes;
    }
    sharesService.vote(share._id, num).then(function(data) {
      share[value] = data;
      sharesService.getByShareId(share._id).then(function(data){
        self.addShare(data);
      });
    });
    refreshShares();
  };

}]);
