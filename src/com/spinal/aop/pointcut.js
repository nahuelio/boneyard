/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['aop/interceptor'], function(Interceptor) {

	/**
	*	PointCut Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.PointCut
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var PointCut = Spinal.namespace('com.spinal.aop.PointCut', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.PointCut}
		**/
		initialize: function() {
			PointCut.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PointCut'

	}));

	return PointCut;

});
