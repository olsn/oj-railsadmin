'use strict';

angular.module('adminDashboardApp')
  .controller('OjmodellistCtrl', function ($scope, OjAdmin) {
    var oa = $scope.oa = OjAdmin;

    $scope.listedAttributes = function() {
        var blueprint = oa.blueprints[$scope.model],
            attributes = [];
        for ( var key in blueprint.attributes ) {
            if ( !oa.configurations[$scope.model][key] || !oa.configurations[$scope.model][key].hidden ) {
                attributes.push(blueprint.attributes[key]);
            }
        }

        return attributes;
    };

    $scope.order = undefined;
    $scope.reverse = false;
    $scope.setOrderBy = function(attrName) {
        if ( $scope.order == attrName ) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.order = attrName;
            $scope.reverse = false;
        }
    }

    // a temp var
    $scope.c_value = undefined;
    $scope.valueOfResourceForAttribute = function(resource, attribute) {
        $scope.c_value = oa.valueOfResourceForAttribute(resource, attribute);
    }

    $scope.isArray = function(value) {
        return value instanceof Array;
    }
    
    $scope.isResource = function(value) {
        return value && value.$blueprint !== undefined;
    }
  });
