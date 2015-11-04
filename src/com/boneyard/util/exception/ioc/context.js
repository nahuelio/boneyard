/**
*	@module com.boneyard.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class ContextException
	*	@namespace com.boneyard.util.exception.ioc
	*	@class com.boneyard.util.exception.ioc.ContextException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var ContextException = Boneyard.namespace('com.boneyard.util.exception.ioc.ContextException',
		BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ioc.ContextException
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
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
		*		UndefinedContext
		*		FactoryNotDeclared
		*		EngineNotDeclared
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UndefinedContext: _.template('Context Not Defined'),
			FactoryNotDeclared: _.template('Factory is required to be able to instanciate <%= clazz %>'),
			EngineNotDeclared: _.template('Engine not declared')
		}

	}));

	return ContextException;

});
