/**
*	@module com.boneyard.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'util/adt/collection'], function(Dependency, Collection) {

	/**
	*	Class Injector
	*	@namespace com.boneyard.ioc.engine.helpers
	*	@class com.boneyard.ioc.engine.helpers.Injector
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.ioc.engine.helpers.dependency
	*	@requires com.boneyard.util.adt.Collection
	**/
	var Injector = Boneyard.namespace('com.boneyard.ioc.engine.helpers.Injector', Boneyard.Class.inherit({

		/**
		*	Initialize
		*	@public
		*	@throws Error
		*	@method initialize
		*	@param annotation {com.boneyard.ioc.engine.annotation.Annotation} annotation reference
		*	@return com.boneyard.ioc.helpers.Injector
		**/
		initialize: function(annotation) {
			annotation.proxify(this, 'get');
			this.dependencies = new Collection(this.get().retrieve(), { interface: Dependency });
			return Injector.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves Engine's Factory
		*	@public
		*	@method getFactory
		*	@return com.boneyard.util.adt.AsyncFactory
		**/
		getFactory: function() {
			return this.get().getEngine().getFactory();
		},

		/**
		*	Retrieves dependencies
		*	@public
		*	@method getDependencies
		*	@return com.boneyard.util.adt.Collection
		**/
		getDependencies: function() {
			return this.dependencies;
		},

		/**
		*	Assings a module instance into the annotation
		*	@public
		*	@method create
		*	@param path {String} annotation module path
		*	@param params {Object} annotation module params
		*	@return com.boneyard.ioc.helpers.Injector
		**/
		create: function(path, params) {
			var annotation = this.get();
			if(annotation.isModule()) annotation._$created = this.getFactory().create(path, params);
			return this;
		},

		/**
		*	Resolve injector dependencies and returns the collection of dependencies resolved.
		*	@public
		*	@method resolve
		*	@return Array
		**/
		resolve: function() {
			return this.getDependencies().invoke('resolve', this);
		},

		/**
		*	Resolves and inject a dependency in the current bone annotation
		*	@public
		*	@method inject
		*	@param dependency {com.boneyard.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.boneyard.ioc.helpers.Dependency
		**/
		inject: function(dependency) {
			dependency.getTarget()[dependency.getProperty()] = dependency.get();
			return this.resolved(dependency);
		},

		/**
		*	Sets this dependency as on hold by assigning resolution strategy as a function
		*	@public
		*	@method hold
		*	@param dependency {com.boneyard.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.boneyard.ioc.engine.helpers.Dependency
		**/
		hold: function(dependency) {
			dependency.hold = _.bind(this.inject, this, dependency);
			return dependency;
		},

		/**
		*	Sets and returns a given dependency as resolved
		*	@public
		*	@method resolved
		*	@param dependency {com.boneyard.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.boneyard.ioc.engine.helpers.Dependency
		**/
		resolved: function(dependency) {
			if(_.defined(dependency.hold)) delete dependency.hold;
			dependency.resolved = true;
			return dependency;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Injector'

	}));

	return Injector;

});
