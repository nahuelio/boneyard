/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Plugin Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.PluginException
	*	@extends com.spinal.util.exception.Exception
	**/
	var PluginException = Spinal.namespace('com.spinal.util.exception.PluginException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.PluginException}
		**/
		initialize: function() {
			return PluginException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		ConfigNotSpecified
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			ConfigNotSpecified: _.template('Config was not defined')
		}

	}));

	return PluginException;

});
