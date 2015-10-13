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
		*	Assings a module instance into the bone
		*	@public
		*	@method create
		*	@param factory {com.spinal.util.factories.AsyncFactory} engine's factory reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		create: function(factory, bone) {
			if(bone.isModule()) bone._$created = factory.create(bone.getPath(), bone.getParams());
			return this;
		},

		/**
		*	Resolve injector dependencies and returns the collection of dependencies resolved.
		*	@public
		*	@method resolve
		*	@param [factory] {com.spinal.util.factories.AsyncFactory} engine's factory reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		resolve: function(factory) {
			this.getDependencies().invoke('resolve', this, factory);
			return this;
		},

		/**
		*	Resolves and inject a dependency in the current bone annotation
		*	@public
		*	@method inject
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@param [factory] {com.spinal.util.factories.AsyncFactory} engine's factory reference
		*	@return com.spinal.ioc.helpers.Dependency
		**/
		inject: function(dependency, factory) {
			dependency.getTarget()[dependency.getProperty()] = dependency.get().bone();
			//console.log('INJECT: ', dependency.getTarget(), dependency.getProperty(), dependency.get().getId());
			return this.resolved(dependency);
		},

		/**
		*	Sets this dependency as on hold by assigning resolution strategy as a function
		*	@public
		*	@method hold
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@param [factory] {com.spinal.util.factories.AsyncFactory} engine's factory reference
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		hold: function(dependency, factory) {
			console.log('HOLD: ', dependency.getId());
			dependency.hold = _.bind(this.inject, this, dependency, factory);
			return dependency;
		},

		/**
		*	Sets and returns a given dependency as resolved
		*	@public
		*	@method resolved
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.spinal.ioc.engine.helpers.Dependency
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
