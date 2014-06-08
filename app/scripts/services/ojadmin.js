'use strict';

angular.module('oj.RailsAdmin',['ngResource'])
	.constant('MODULE_VERSION', '0.0.3');

angular.module('oj.RailsAdmin')
  .service('OjAdmin', function OjAdmin($resource) {
  	var self = this;
    var API_URL = 'http://localhost:3000/';

    self.models = [];
    self.configurations = {};
    self.resources = {};
    self.blueprints = {};
    self.collections = {};
    
    self.init = function(url, models) {
    	self.API_URL = url;
    	self.models.push.apply(self.models, models);

        var c,l,model;
        for ( c = 0, l = self.models.length; c < l; ++c ) {
            model = self.models[c];
            self.configurations[model] = {};

            self.resources[model] = $resource(API_URL + ':action/:id', {
                id: '@id',
                action: plural_name(model)
            }, {
                blueprint: {
                    method: 'GET',
                    params: {
                        action: 'blueprint',
                        id: model
                    }
                },
                update: {
                    method: 'PUT'
                }
            });

            self.blueprints[model] = self.resources[model].blueprint();
            self.blueprints[model].$name = model;

            self.collections[model] = self.resources[model].query();
            self.collections[model].$name = model;

           /* self.blueprints[model].$promise.then(function() {
                console.log(self);
            });*/
        }
    };

    self.hideAttribute = function(model, attribute) {
    	if ( attribute instanceof Array ) {
    		_.each(attribute, function(attr) {
    			doHideAttribute(model, attr);
    		})
    	} else {
    		doHideAttribute(model, attribute);
    	}
    };

    function doHideAttribute(model, attribute) {
    	var attrConfig = self.configurations[model][attribute] = self.configurations[model][attribute] || {};
    	attrConfig.hidden = true;
    };

    self.editeableAttributes = function(model) {
        if ( !self.blueprints[model] || !self.blueprints[model].attributes ) 
            return null;

        var blueprint = self.blueprints[model],
            attributes = _.clone(blueprint.attributes);

        _.each(attributes, function(attribute, key) {
        	if ( !attribute.sql_type ) {
        		delete attributes[key];
        	}
        })

        delete attributes.id;
        delete attributes.created_at;
        delete attributes.updated_at;

        return attributes;
    };

    self.inputTypeForAttribute = function(attribute) {
        if ( /*(attribute.type == 'integer' || attribute.type == 'string') &&*/ attribute.class_name == undefined ) {
            return 'input';
        } else if ( attribute.class_name != undefined && attribute.macro == 'belongs_to' ) {
            return 'select';
        }
    };

    self.valueOfResourceForAttribute = function(resource, attribute) {
    	var value = resource[attribute.name];
    	if ( attribute.class_name != undefined && self.blueprints[attribute.class_name] != null ) {
    		var targetCollection = self.collections[attribute.class_name];
    		if ( attribute.macro.indexOf('belongs_to') >= 0 ) {
    			// find the one object based on the id
    			return _.findWhere(targetCollection ,{id: value});
    		} else if ( attribute.macro.indexOf('has_many') >= 0 ) {
    			// basically the inversion of 'belongs_to' => all items with the resource.id as foreign_key
    			var model = self.getModelForResource(resource),
    				attributes = self.blueprints[model].attributes,
    				whereProperties = {};

    			if ( attribute.through === undefined ) {
    				whereProperties[attribute.foreign_key] = resource.id;
    				return _.where(targetCollection, whereProperties);
    			} else {
    				var throughAttribute = self.blueprints[model].attributes[attribute.through],
    					throughResources = self.valueOfResourceForAttribute(resource, throughAttribute),
    					valueCollection = [];

    				_.each(throughResources, function(subResource) {
    					var subModel = self.getModelForResource(subResource);
    					valueCollection.push(self.valueOfResourceForAttribute(subResource, self.blueprints[subModel].attributes[attribute.foreign_key]));
    				});
    				return valueCollection;
    			}
    		}
    	} else {
    		return value;
    	}
    };

    self.getModelForResource = function(resource) {
    	return _.find(self.collections, function(collection) { return collection.indexOf(resource) >= 0; }).$name;
    };

    self.create = function(model, attributes) {
        var resource = self.resources[model],
            obj = {};

        obj[model.toLowerCase()] = attributes;

        var res = resource.save(obj),
            collection = self.collections[model];
        res.$promise.then(function() {
            collection.push(res);
        });

        return res;
    };

    function plural_name(model) {
        return model.toLowerCase() + 's';
    };

    window.oa = self;
  });
