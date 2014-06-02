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
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.error.exception)
		*		InvalidIDType
		*		SuccessorNotSpecified
		*		InvalidSuccessorType
		*		InvalidModelType
		*		UnsupportedRenderMethod
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			InvalidIDType: '\'id\' parameter must be a String in the constructor.',
			SuccessorNotSpecified: '\'successor\' parameter was not speficied in the constructor.',
			InvalidSuccessorType: '\'successor\' must be an instance of com.spinal.ui.Container.',
			InvalidModelType: '\'model\' must be an instance of Backbone.Model.',
			UnsupportedRenderMethod: 'unsupported render method -> \'{{method}}\'.'
		}

	}));

	return UIException;

});
