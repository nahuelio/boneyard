/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone',
		'util/exception/processor'], function(Context, BoneProcessor, ProcessorException) {

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
		*	@method _enqueue
		*	@param id {String} module id
		*	@param success {Function} callback function to be executed once the module is loaded
		*	@return Object
		**/
		_enqueue: function(id, success) {
			this._engine.factory.push({ id: id, path: (this.defaultPath + id), callback: success });
			return this;
		},

		/**
		*	Function as partial that creates an instance of the module plugin by passing the parameters to
		*	the constructor function (including params)
		*	@private
		*	@method _create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param params {Object} plugin params
		*	@param pluginName {String} plugin name to pass to the factory to create an instance
		*	@return Object
		**/
		_create: function(params, pluginName) {
			return this._engine.factory.create(pluginName, ((params) ? params : {}), this._engine).execute();
		},

		/**
		*	Process all plugins extracted from the root spec
		*	@public
		*	@method process
		*	@param plugins {Object} plugins reference
		*	@return Array
		**/
		process: function(plugins) {
			return _.map(plugins, function(params, id) {
				this._enqueue(id, _.bind(_.partial(this._create, params), this));
				return id;
			}, this);
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var plugins = (this._engine.plugin()) ? this.process(this._engine.root[this._engine.__plugins]) : [];
			this._engine.factory.load(_.bind(function() {
				delete this._engine.root[this._engine.__plugins];
				this.trigger(PluginProcessor.EVENTS.processed, {  type: PluginProcessor.NAME, plugins: plugins });
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
