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
  $log.log(self.shares);

  self.newShare = Share();

  self.addShare = function () {
    var share = Share(self.newShare);

    sharesService.addShare(share).then(function () {

      self.shares = self.shares.filter(function (existingShare) {
        return existingShare._id !== share._id;
      });

      self.shares.push(share);
    });

    self.newShare = Share();
  };
}]);
