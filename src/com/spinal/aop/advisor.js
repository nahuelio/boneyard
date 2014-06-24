/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['aop/interceptor'], function(Interceptor) {

	/**
	*	Advisor Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Advisor
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var Advisor = Spinal.namespace('com.spinal.aop.Advisor', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Advisor}
		**/
		initialize: function() {
			Advisor.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Advisor'

	}));

	return Advisor;

});
