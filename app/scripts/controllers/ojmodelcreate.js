'use strict';

angular.module('oj.RailsAdmin')
  .controller('OjmodelcreateCtrl', function ($scope, OjAdmin) {
  	var oa = $scope.oa = OjAdmin;

  	$scope.creation = {};
    $scope.create = function() {
        var res = oa.create($scope.model, $scope.creation);

        res.$promise.then($scope.clear);
    };

    $scope.clear = function() {
    	for ( var key in $scope.creation ) {
    		$scope.creation[key] = undefined;
    	}
    };
  });
