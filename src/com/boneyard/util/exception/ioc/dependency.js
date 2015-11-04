/**
*	@module com.boneyard.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class DependencyException
	*	@namespace com.boneyard.util.exception.ioc
	*	@class com.boneyard.util.exception.ioc.DependencyException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var DependencyException = Boneyard.namespace('com.boneyard.util.exception.ioc.DependencyException',
		BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ioc.DependencyException
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
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
		*		TargetRequired
		*		PropertyRequired
		*		UndefinedTargetProperty
		*		UndefinedBoneReference
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			TargetRequired: _.template('Dependency Target is not defined'),
			PropertyRequired: _.template('Dependency Target Property is not defined'),
			UndefinedTargetProperty: _.template('Dependency Target property doesn\'t exists in Dependency Target'),
			UndefinedBoneReference: _.template('Dependency Bone Reference is not defined')
		}

	}));

	return DependencyException;

});
