/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor'], function(Processor) {

	/**
	*	Class PluginProcessor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.PluginProcessor
	*	@extends com.spinal.ioc.processor.Processor
	*
	*	@requires com.spinal.ioc.processor.Processor
	**/
	var PluginProcessor = Spinal.namespace('com.spinal.ioc.processor.PluginProcessor', Processor.inherit({

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
		*	@return com.spinal.ioc.processor.PluginProcessor
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
		*	@return com.spinal.ioc.processor.PluginProcessor
		**/
		enqueue: function(plugin) {
			this.getFactory().push({
				path: (this.defaultPath + plugin.getId()),
				callback: _.bind(this.onLoad, this, plugin)
			});
			return this;
		},

		/**
		*	Default plugin load handler that creates an instance and triggers plugin execution.
		*	@public
		*	@method onLoad
		*	@param plugin {com.spinal.ioc.engine.annotation.Plugin} plugin annotation reference
		*	@return com.spinal.ioc.processor.PluginProcessor
		**/
		onLoad: function(plugin) {
			plugin.create().run();
			return this;
		},

		/**
		*	Process all plugins available from the Engine
		*	@public
		*	@chainable
		*	@method process
		*	@param plugin {Object} plugins reference
		*	@return com.spinal.ioc.processor.PluginProcessor
		**/
		process: function(plugin) {
			return this.enqueue(plugin.resolve());
		},

		/**
		*	Execute Processor
		*	@public
		*	@override
		*	@chainable
		*	@method execute
		*	@return com.spinal.ioc.engine.processor.PluginProcessor
		**/
		execute: function() {
			PluginProcessor.__super__.execute.call(this, this.getEngine().plugins.collection, this.process);
			this.getFactory().load(_.bind(this.done, this, PluginProcessor.NAME));
			return this;
		},

		/**
		*	Default processor done handler
		*	@public
		*	@override
		*	@chainable
		*	@method done
		*	@param type {String} Processor type
		*	@return com.spinal.ioc.processor.PluginProcessor
		**/
		done: function(type) {
			return PluginProcessor.__super__.done.call(this, type);
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
