/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'util/adt/collection'], function(Dependency, Collection) {

	/**
	*	Class Injector
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Injector
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.helpers.dependency
	*	@requires com.spinal.util.adt.Collection
	**/
	var Injector = Spinal.namespace('com.spinal.ioc.engine.helpers.Injector', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@throws Error
		*	@method initialize
		*	@param annotation {com.spinal.ioc.engine.annotation.Annotation} annotation reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		initialize: function(annotation) {
			annotation.proxify(this, 'get');
			this.dependencies = new Collection(this.get().retrieve(), { interface: Dependency });
			return Injector.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves dependencies
		*	@public
		*	@method getDependencies
		*	@return com.spinal.util.adt.Collection
		**/
		getDependencies: function() {
			return this.dependencies;
		},

		/**
		*	Creates Bone module instance
		*	@public
		*	@method create
		*	@param instance {Object} module instance
		*	@return
		**/
		create: function(instance) {
			this.get()._$created = instance;
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
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.spinal.ioc.helpers.Dependency
		**/
		inject: function(dependency) {
			dependency.getTarget()[dependency.getProperty()] = dependency.get();
			if(_.defined(dependency.hold)) delete dependency.hold;
			return dependency;
		},

		/**
		*	Sets this dependency as on hold by assigning resolution strategy as a function
		*	@public
		*	@method hold
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		hold: function(dependency) {
			return dependency.hold = _.bind(this.inject, this, dependency);
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
