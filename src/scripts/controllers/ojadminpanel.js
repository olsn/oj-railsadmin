'use strict';

angular.module('oj.RailsAdmin')
  .controller('OjadminpanelCtrl', function ($scope, OjAdmin) {
  	var oa = $scope.oa = OjAdmin;
  	$scope.currentModel = oa.models[0];

  	$scope.setCurrentModel = function(model) {
  		$scope.currentModel = model;
  	};
    
  });
