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
		*	@param plugins {Object} plugins reference
		*	@return Array
		**/
		extract: function(plugins) {
			return _.compact(_.map(plugins, function(plugin, name) {
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
		NAME: 'Plugins',

		/**
		*	Gather plugins bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$plugins');
		}

	}));

	return Plugins;

});
