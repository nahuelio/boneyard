/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/adt/stack',
		'util/factories/factory'], function(Spinal, Stack, Factory) {

	/**
	*	BoneFactory Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.BoneFactory
	*	@extends com.spinal.core.SpinalClass
	**/
	var BoneFactory = Spinal.namespace('com.spinal.ioc.BoneFactory', Factory.inherit({

		/**
		*	Stack module
		*	@public
		*	@property stack
		*	@type {com.spinal.util.adt.Stack}
		**/
		modules: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		initialize: function() {
			this.modules = new Stack();
			return BoneFactory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Set a new collection of elements to be inserted in the modules stack
		*	@public
		*	@method set
		*	@param arr {Array} new collection to be replaced
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		set: function(arr) {
			if(!arr || !_.isArray(arr)) return false;
			this.modules.reset({ silent: true });
			this.modules.set(arr);
			return this;
		},

		/**
		*	Adds a new module into the stack
		*	If the module has a dependency that was added previously, it will swap positions.
		*	@public
		*	@chainable
		*	@method addModule
		*	@param module {Object} module data
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		add: function(module, callback) {
			if(!module || !_.isObject(module)) return this;
			var eModule = this.exists(module.id);
			(eModule) ? eModule.dependency = eModule.dependency.concat(module.dependency) : this.modules.push(module);
			if(module.dependency) this.swap(module.id, module.dependency[0].id);
			return this;
		},

		/**
		*	Removes a module from the stack
		*	@public
		*	@chainable
		*	@method removeModule
		*	@param module {Object} module data used to remove the module
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		remove: function(module) {
			if(!module) return this;
			this.modules.removeBy(_.bind(function(m) { return (m.id && module.id && m.id === module.id);  }, this));
			return this;
		},

		/**
		*   Returns the 1-based position where an object is on the modules stack by id
		*	@public
		*	@method search
		*	@param id {String} module id
		*	@return Number
		**/
		getPos: function(id) {
			return this.modules.findPos(function(element) { return (element.id === id); });
		},

		/**
		*	Checks if the module exists or was added into the stack by module id
		*	@public
		*	@method exists
		*	@param moduleId {String} module id
		*	@return Boolean
		**/
		exists: function(moduleId) {
			if(!moduleId || moduleId === '') return false;
			return this.modules.find(function(module) { return (module.id === moduleId); });
		},

		/**
		*	Swaps modules order based on dependents
		*	@public
		*	@method swap
		*	@param moduleId {Object} module data
		*	@param dependency {Object} dependency data
		*	@return Boolean
		**/
		swap: function(moduleId, dependencyId) {
			var modPos = this.getPos(moduleId), depPos = this.getPos(dependencyId);
			if(!_.isNull(modPos) && !_.isNull(depPos)) this.modules.swap(function(e, i) {
				return (i === depPos && modPos < i) ? modPos : null;
			});
			return this;
		},

		/**
		*	Load an specific module
		*	@public
		*	@method load
		*	@param module {Object} module data required
		*	@param [modules] {Array} List of modules
		*	@param [callback] callback
		*	@FIXME: Improve the portability of this by not being too specific with the parameters
		*	('modules' is irrelevant if I want to access this method to load a single module).
		**/
		register: function(module, modules, callback) {
			require([module.class], _.bind(function(c) {
				modules.push(BoneFactory.__super__.register.apply(this, [c.NAME, c]));
				if(module.success) module.success(c.NAME, module);
				this.load(callback, modules);
			}, this));
		},

		/**
		*	Loads and Registers a list of modules into the factory.
		*	@public
		*	@method load
		*	@param [callback] {Function} Optional Callback
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		load: function(callback, modules) {
			if(m = this.modules.pop()) {
				if(!modules) modules = [];
				if(!m.id || !m.class) this.register(callback, modules);
				this.register(m, modules, callback);
			} else {
				this.modules.reset({ silent: true });
				if(callback && _.isFunction(callback)) callback(modules);
			}
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneFactory'

	}));

	return BoneFactory;

});
