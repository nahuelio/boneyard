/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Interceptor Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Interceptor
	*	@extends com.spinal.core.SpinalClass
	**/
	var Interceptor = Spinal.namespace('com.spinal.aop.Interceptor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Interceptor}
		**/
		initialize: function() {
			Interceptor.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Interceptor'

	}));

	return Interceptor;

});
