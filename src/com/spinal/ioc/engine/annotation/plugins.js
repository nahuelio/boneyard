/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'util/string'], function(Annotation, StringUtil) {

	/**
	*	Class Plugins
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Plugins
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.util.StringUtil
	**/
	var Plugins = Spinal.namespace('com.spinal.ioc.engine.annotation.Plugins', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Plugins
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			Plugins.__super__.initialize.call(this, attrs);
			_.extend(this, StringUtil.toPrivate(attrs));
			return this;
		},

		/**
		*	Extracts plugins from Spec annotation
		*	@public
		*	@method extract
		*	@param spec {com.spinal.ioc.engine.annotation.Spec} spec annotation
		*	@return Array
		**/
		extract: function(spec) {
			return _.compact(_.map(spec.getPlugins(), function(plugin, name) {
				return !this.getPlugin(name) ? (this[name] = plugin) : null;
			}));
		},

		/**
		*	Retrieves plugin
		*	@public
		*	@method getPlugin
		*	@param name {String} plugin name
		*	@return Object
		**/
		getPlugin: function(name) {
			return this[name];
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Plugins'

	}));

	return Plugins;

});
