'use strict';

angular.module('oj.RailsAdmin')
  .directive('ojAdminPanel', function () {
    return {
      templateUrl: 'views/oj-admin-panel.html',
      restrict: 'AE',
      scope: {},
      controller: 'OjadminpanelCtrl'
    };
  });
