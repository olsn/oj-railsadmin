'use strict';

angular.module('oj.RailsAdmin')
  .directive('ojModelCreate', function () {
    return {
      templateUrl: 'views/oj-model-create.html',
      restrict: 'AE',
      scope: {
      	model: '@ojModelCreate'
      },
      controller: 'OjmodelcreateCtrl'
    };
  });
