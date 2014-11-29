/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	IoC Context Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.ContextException
	*	@extends com.spinal.util.exception.Exception
	**/
	var ContextException = Spinal.namespace('com.spinal.util.exception.ContextException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.ContextException}
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
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		UndefinedContext
		*		InvalidSpecFormat
		*		SpecIdRequired
		*		FactoryNotDeclared
		*		EngineNotDeclared
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UndefinedContext: _.template('Context Not Defined'),
			InvalidSpecFormat: _.template('Invalid Spec Format'),
			SpecIdRequired: _.template('Spec ID was not defined'),
			FactoryNotDeclared: _.template('Factory is required to be able to instanciate <%= clazz %>'),
			EngineNotDeclared: _.template('Engine not declared')
		}

	}));

	return ContextException;

});
