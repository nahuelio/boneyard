/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	UI Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.UIException
	*	@extends com.spinal.util.exception.Exception
	**/
	var UIException = Spinal.namespace('com.spinal.util.exception.UIException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.UIException}
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
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		InvalidIDType
		*		SuccessorNotSpecified
		*		InvalidSuccessorType
		*		UIStackViolation
		*		InvalidModelType
		*		UnsupportedRenderMethod
		*		InvalidInterfaceType
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			InvalidIDType: '\'id\' parameter must be a String in the constructor.',
			SuccessorNotSpecified: '\'successor\' parameter was not speficied in the constructor.',
			InvalidSuccessorType: '\'successor\' must be an instance of com.spinal.ui.Container.',
			UIStackViolation: 'UI Stack Violation found: view \'{{viewId}}\' can not be found inside the successor specified \'{{succesorId}}\'.',
			InvalidModelType: '\'model\' must be an instance of Backbone.Model.',
			UnsupportedRenderMethod: 'unsupported render method -> \'{{method}}\'.',
			InvalidInterfaceType: 'unsupported Interface Type'
		}

	}));

	return UIException;

});
