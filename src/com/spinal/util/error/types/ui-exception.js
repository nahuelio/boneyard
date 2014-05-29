/**
*	@module com/spinal/util/error/types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/error/exception'], function(Spinal, Exception) {

	/**
	*	Define a UI Exception type that occurs in the spinal ui package
	*	@namespace com.spinal.util.error.types
	*	@class com.spinal.util.error.types.UIException
	*	@extends com.spinal.util.error.Exception
	**/
	var UIException = Spinal.namespace('com.spinal.util.error.types.UIException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.error.types.UIException}
		**/
		initialize: function() {
			return UIException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIException',

		/**
		*	@static
		*	@property TYPES
		*	@type Array
		**/
		TYPES: [
			{ name: 'InvalidIDType', message: '\'id\' parameter must be a String in the constructor.' },
			{ name: 'SuccesorNotSpecified', message: '\'succesor\' parameter was not speficied in the constructor.' },
			{ name: 'InvalidSuccesorType', message: '\'succesor\' must be an instance of com.spinal.ui.Container.' },
			{ name: 'InvalidModelType', message: '\'model\' must be an instance of Backbone.Model.' },
			{ name: 'UnsupportedRenderMethod', message: 'unsupported render method -> \'{{method}}\'.' }
		]

	}));

	return UIException;

});
