/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['aop/interceptor'], function(Interceptor) {

	/**
	*	Advice Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Advice
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var Advice = Spinal.namespace('com.spinal.aop.Advice', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Advice}
		**/
		initialize: function() {
			Advice.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Advice'

	}));

	return Advice;

});
