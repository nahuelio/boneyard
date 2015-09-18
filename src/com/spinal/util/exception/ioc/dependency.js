/**
*	@module com.spinal.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Class DependencyException
	*	@namespace com.spinal.util.exception.ioc
	*	@class com.spinal.util.exception.ioc.DependencyException
	*	@extends com.spinal.util.exception.Exception
	**/
	var DependencyException = Spinal.namespace('com.spinal.util.exception.ioc.DependencyException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.util.exception.ioc.DependencyException
		**/
		initialize: function() {
			return DependencyException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'DependencyException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		TargetRequired
		*		PropertyRequired
		*		InjectorRequired
		*		UndefinedTargetProperty
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			TargetRequired: _.template('Dependency Target is not defined'),
			PropertyRequired: _.template('Dependency Target Property is not defined'),
			InjectorRequired: _.template('Dependency requires an instance of injector in order to work'),
			UndefinedTargetProperty: _.template('Dependency Target property doesn\'t exists in Dependency Target')
		}

	}));

	return DependencyException;

});
