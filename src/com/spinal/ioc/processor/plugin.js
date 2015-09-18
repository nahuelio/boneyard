/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone',
		'ioc/engine/helpers/injector',
		'util/exception/ioc/processor'], function(Context, BoneProcessor, Injector, ProcessorException) {

	/**
	*	Defines a processor that acts as a wrapper to trigger plugins functionality
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.PluginProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var PluginProcessor = Spinal.namespace('com.spinal.ioc.processor.PluginProcessor', BoneProcessor.inherit({

		/**
		*	Default plugins path processors
		*	@public
		*	@property defaultPath
		*	@type String
		**/
		defaultPath: 'ioc/plugins/',

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return PluginProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Adds a new plugin module into the async factory stack
		*	@private
		*	@chainable
		*	@method enqueue
		*	@param plugin {Object} plugin metadata information
		*	@return Object
		**/
		enqueue: function(plugin) {
			console.log(plugin);
			var injector = new Injector(this, plugin), callback = _.bind(this.create, this, injector);
			this.factory().push({ path: plugin.path, id: plugin.id, callback: callback });
			return plugin;
		},

		/**
		*	Function as partial that creates an instance of the module plugin by passing the parameters to
		*	the constructor function (including params)
		*	@public
		*	@method create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param params {Object} plugin params
		*	@param pluginName {String} plugin name to pass to the factory to create an instance
		*	@return Object
		**/
		create: function(injector, path) {
			if(!injector || !path) throw new ProcessorException('CreateModuleException');
			return this._engine.create(injector.inject());
		},

		/**
		*	Process all plugins extracted from the root spec
		*	@public
		*	@method process
		*	@param plugins {Object} plugins reference
		*	@return Array
		**/
		process: function(plugins) {
			return _.flatten(_.map(plugins, function(params, id) {
				return this.enqueue(_.extend({ id : id }, params));
			}, this));
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var plugins = (this._engine.plugin()) ? this.process(this._engine.root[this._engine.__plugins]) : [];
			this.factory().load(_.bind(function() {
				delete this._engine.root[this._engine.__plugins];
				this.complete(PluginProcessor.NAME, plugins);
			}, this));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginProcessor'

	}));

	return PluginProcessor;

});
