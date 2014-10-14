/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	HTML IoC Plugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	**/
	var HTMLPlugin = Spinal.namespace('com.spinal.ioc.plugins.HTMLPlugin', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param opts {Object} options
		*	@param context {com.spinal.ioc.Context} context reference
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		initialize: function(opts, context) {
			opts || (opts = {});
			this.ctx = context;
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		execute: function() {
			console.log(this);
			console.log(HTMLPlugin.NAME + ' executing...');
			// TODO: Implement this
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'HTMLPlugin'

	}));

	return HTMLPlugin;

});
