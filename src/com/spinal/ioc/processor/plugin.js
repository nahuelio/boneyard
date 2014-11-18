/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone'], function(Context, BoneProcessor) {

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
		*	Supported Notation Regular Expression
		*	@public
		*	@property notationRE
		*	@type RegExp
		**/
		notationRE: new RegExp('\\' + Context.PREFIX + '(plugins)$', 'i'),

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
		*	Plugin Load handler
		*	@private
		*	@method _onPluginLoaded
		*	@param pluginName {String} Plugin module name
		*	@param plugin {com.spinal.core.Spinal.SpinalClass} plugin module constructor
		**/
		_onPluginLoaded: function(pluginName, plugin) {
			var params = (plugin.params) ? plugin.params : {};
			Context.BoneFactory.create(pluginName, params, this.ctx).execute();
		},

		/**
		*	Process plugin detected by handle notation
		*	@public
		*	@method process
		*	@param name {Object} plugin name
		*	@param params {Object} plugin params passed to the plugin constructor
		*	@return Object
		**/
		process: function(name, params) {
			Context.BoneFactory.add({
				id: name, class: (this.defaultPath + name),
				params: params, success: _.bind(this._onPluginLoaded, this)
			});
			return name;
		},

		/**
		*	Handles specifc notation with the current processor
		*	@public
		*	@method handleNotation
		*	@param params {Object} plugin params passed to the plugin constructor
		*	@param pluginName {Object} plugin name
		*	@return Boolean
		**/
		handleNotation: function(params, pluginName) {
			return this.process(pluginName, params);
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			/**
			var plugins = this.ctx.query.findBoneById('$plugins');
			if(plugins) {
				plugins = _.map(plugins, this.handleNotation, this);
				Context.BoneFactory.load(_.bind(function() {
					delete this.ctx.spec['$plugins'];
					this.ctx.trigger(Context.EVENTS.plugin, plugins);
					this.ctx.trigger(Context.EVENTS.processed, { type: PluginProcessor.NAME });
				}, this));
			} else {
				this.ctx.trigger(Context.EVENTS.processed, { type: PluginProcessor.NAME });
			}
			**/
			this.trigger(PluginProcessor.EVENTS.processed, {  type: PluginProcessor.NAME });
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
