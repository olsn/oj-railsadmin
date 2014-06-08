'use strict';

angular.module('oj.RailsAdmin')
  .directive('ojModelList', function () {
    return {
      templateUrl: 'views/oj-model-list.html',
      restrict: 'AE',
      scope: {
      	model: '@ojModelList'
      },
      controller: 'OjmodellistCtrl'
    };
  });
