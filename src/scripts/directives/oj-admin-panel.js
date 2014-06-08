'use strict';

angular.module('adminDashboardApp')
  .directive('ojAdminPanel', function () {
    return {
      templateUrl: 'views/oj-admin-panel.html',
      restrict: 'AE',
      scope: {},
      controller: 'OjadminpanelCtrl'
    };
  });
