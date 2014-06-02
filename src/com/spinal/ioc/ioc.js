/**
*	@module com/spinal/ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	IOC Core module
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.IocCore
	*	@extends com.spinal.core.SpinalClass
	**/
	var IocCore = Spinal.namespace('com.spinal.ioc.IocCore', Spinal.SpinalClass.inheirt({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.IocCore}
		**/
		initialize: function() {
			return IocCore.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'IocCore'

	}));

});
