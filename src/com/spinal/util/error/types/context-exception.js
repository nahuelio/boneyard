/**
*	@module com/spinal/util/error/types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/error/exception'], function(Spinal, Exception) {

	/**
	*	IoC Context Exception Type
	*	@namespace com.spinal.util.error.types
	*	@class com.spinal.util.error.types.ContextException
	*	@extends com.spinal.util.error.Exception
	**/
	var ContextException = Spinal.namespace('com.spinal.util.error.types.ContextException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.error.types.ContextException}
		**/
		initialize: function() {
			return ContextException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ContextException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.error.exception)
		*		UndefinedContext
		*		InvalidSpecFormat
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UndefinedContext: 'Context Not Defined',
			InvalidSpecFormat: 'Invalid Spec Format'
		}

	}));

	return ContextException;

});
