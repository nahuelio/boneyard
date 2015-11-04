/**
*	@module com.boneyard.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor',
	'ioc/plugins/plugin',
	'util/adt/queue'], function(Processor, IoCPlugin, Queue) {

	/**
	*	Class PluginProcessor
	*	@namespace com.boneyard.ioc.processor
	*	@class com.boneyard.ioc.processor.PluginProcessor
	*	@extends com.boneyard.ioc.processor.Processor
	*
	*	@requires com.boneyard.ioc.processor.Processor
	*	@requires com.boneyard.ioc.plugins.Plugin
	*	@requires com.boneyard.util.adt.Queue
	**/
	var PluginProcessor = Boneyard.namespace('com.boneyard.ioc.processor.PluginProcessor', Processor.inherit({

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
		*	@return com.boneyard.ioc.processor.PluginProcessor
		**/
		initialize: function() {
			this.execution = new Queue([], { capacity: 1 });
			return PluginProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Adds a new plugin module into the async factory stack
		*	@private
		*	@chainable
		*	@method enqueue
		*	@param plugin {Object} plugin metadata information
		*	@return com.boneyard.ioc.processor.PluginProcessor
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
		*	@param plugin {com.boneyard.ioc.engine.annotation.Plugin} plugin annotation reference
		*	@param path {String} plugin module path
		*	@return com.boneyard.ioc.processor.PluginProcessor
		**/
		onLoad: function(plugin, path) {
			plugin.create(path).on(IoCPlugin.EVENTS.done, this.onPluginDone, this);
			plugin.run();
			return this;
		},

		/**
		*	Process all plugins available from the Engine
		*	@public
		*	@chainable
		*	@method process
		*	@param plugin {Object} plugins reference
		*	@return com.boneyard.ioc.processor.PluginProcessor
		**/
		process: function(plugin) {
			return this.enqueue(plugin.resolve());
		},

		/**
		*	Retrieves a list of plugins annotations that have not been executed
		*	@public
		*	@method plugins
		*	@return Array
		**/
		plugins: function() {
			return this.getEngine().plugins.filter(function(plugin) { return !plugin.isExecuted(); });
		},

		/**
		*	Execute Processor
		*	@public
		*	@override
		*	@chainable
		*	@method execute
		*	@return com.boneyard.ioc.engine.processor.PluginProcessor
		**/
		execute: function() {
			var plugins = this.plugins();
			if(plugins.length > 0) {
				this.execution.set(plugins, { capacity: plugins.length });
				PluginProcessor.__super__.execute.call(this, plugins, this.process);
				this.getFactory().load();
			} else {
				this.done(PluginProcessor.NAME);
			}
			return this;
		},

		/**
		*	Default Plugin finish execution handler
		*	@public
		*	@method onPluginDone
		*	@param plugin {com.boneyard.ioc.plugins.Plugin} plugin reference
		*	@return com.boneyard.ioc.engine.processor.PluginProcessor
		**/
		onPluginDone: function(plugin) {
			this.execution.poll();
			plugin.off(IoCPlugin.EVENTS.done);
			if(this.execution.isEmpty()) this.done(PluginProcessor.NAME);
			return this;
		},

		/**
		*	Default processor done handler
		*	@public
		*	@override
		*	@chainable
		*	@method done
		*	@param type {String} Processor type
		*	@return com.boneyard.ioc.processor.PluginProcessor
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
