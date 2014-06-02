/**
*	@module com/spinal/aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	AOP Core module
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.AopCore
	*	@extends com.spinal.core.SpinalClass
	**/
	var AopCore = Spinal.namespace('com.spinal.aop.AOP', Spinal.SpinalClass.inheirt({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.aop.AopCore}
		**/
		initialize: function() {
			return AopCore.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'AopCore'

	}));

});
