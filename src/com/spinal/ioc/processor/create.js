/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'ioc/engine',
	'ioc/processor/bone',
	'util/exception/processor'], function(Context, Engine, BoneProcessor, ProcessorException) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Filters out bones without any type of prefixes suitable for this processor
		*	@private
		*	@method _root
		*	@return Object
		**/
		_root: function() {
			return _.omit(this._engine.root, function(v, k) { return (k.indexOf(Engine.PREFIX) === 0); });
		},

		/**
		*	Add the module into the async factory stack
		*	@private
		*	@method _enqueue
		*	@param id {String} module id
		*	@param success {Function} callback function to be executed once the module is loaded
		*	@param dependencies {Array} dependencies for the current module being enqueued
		*	@return Object
		**/
		_enqueue: function(id, success, dependencies) {
			if(!(module = this._engine.getBone(id))) throw new ProcessorException('BoneNotFound');
			this._engine.factory.push({ id: id, path: module.$module, callback: success });
			return this._sorting(id, module, dependencies);
		},

		/**
		*	Resolves module's ordering based on module's dependencies inside the current factory stack
		*	@private
		*	@method _sorting
		*	@param id {String} module id
		*	@param module {Object} module reference
		*	@param dependencies {Array} dependencies for the current module id
		*	@return Object
		**/
		_sorting: function(id, module, dependencies) {
			if(dependencies.length === 0) return module;
			var dpos = _.map(dependencies, function(d) { return this._engine.factory.findPosById(d.id); }, this);
			this._engine.factory.swap(_.bind(function(maxp, minp, m, ix) {
				return (id === m.id && ix <= maxp) ? maxp : ix;
			}, this, _.max(dpos), _.min(dpos)));
			return module;
		},

		/**
		*	Function as partial that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists)
		*	@private
		*	@method _create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param dependecies {Array} array of dependencies (module ids)
		*	@param bone {Object} bone reference
		*	@param moduleName {String} module name to pass to factory to create an instance
		*	@return Object
		**/
		_create: function(dependencies, bone, moduleName) {
			if(!bone || !moduleName) throw new ProcessorException('CreateModuleException');
			if(dependencies && dependencies.length > 0) this._inject(bone.$params, dependencies);
			return (bone._$created = this._engine.factory.create(moduleName, bone.$params));
		},

		/**
		*	Inject dependency via constructor params into the current module
		*	@private
		*	@method _inject
		*	@param obj {Object} object in which the dependency will be injected
		*	@param deps {Array} list of dependencies (modules ids)
		**/
		_inject: function(obj, deps) {
			_.each(deps, function(dep) { obj[dep.property] = this._engine.getBone(dep.id); }, this);
		},

		/**
		*	Handles bone's metadata declarations to determine dependencies and act accordingly.
		*	@private
		*	@method _dependencies
		*	@param params {Object} object to be evaluated
		*	@return Object
		**/
		_dependencies: function(params) {
			return _.compact(_.map(params, function(value, key, obj) {
				if(_.isArray(value)) return _.flatten(this._dependencies(value));
				if(!this._resolve(value, obj, key)) return { id: this.getDependencyId(value), property: key };
			}, this));
		},

		/**
		*	Resolve Bone Expression
		*	@private
		*	@method _resolve
		*	@param expr {String} expression to be evaluated
		*	@param parent {Object} parent bone reference
		*	@param key {Object} property key of the parent bone in which the dependency extracted from expr will be
		*	injected
		*	@return Boolean
		**/
		_resolve: function(expr, parent, key) {
			if(!expr || !parent) return null;
			if(!this.validate(expr)) return key;
			if(!this.isModuleDependency(expr)) return (parent[key] = this.getDependency(expr));
		},

		/**
		*	Evaluates and process all bones inside the spec and return them one by one.
		*	@public
		*	@method process
		*	@param bone {Object} bone reference to be evaluated
		*	@param id {String} bone id to be evaluated
		*	@param [parent] {Object} optional parent bone (when nesting through arrays or objects)
		*	@return Boolean
		**/
		process: function(bone, id, parent) {
			if(this._engine.isModule(bone)) {
				var deps = this._dependencies(bone.$params);
				return this._enqueue(id, _.bind(_.partial(this._create, deps, bone), this), deps);
			} else if(_.isObject(bone) || _.isArray(bone)) {
				return CreateProcessor.__super__.execute.call(this, this.process, bone, id);
			}
			return (!_.isNull(parent)) ? this._resolve(bone, parent, id) : bone;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var bs = CreateProcessor.__super__.execute.call(this, this.process);
			this._engine.factory.load(_.bind(function() {
				this.trigger(CreateProcessor.EVENTS.processed, { type: CreateProcessor.NAME, bones: bs });
			}, this));
			return this;
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});
